import { Ctor } from '../decorator';
import { ModelMessage } from '../protocol/model-message';
import { getSavedEntity } from './find';
import { getIdKey, getModelName } from './model';
import { SavedEntity } from './saved-entity';

export const id =  Symbol.for('entity:id');

export function save<T>(entity: Pick<T, keyof T>): ModelMessage {
    const ctor = getCtor(entity);
    const idKey = getIdKey(ctor) as keyof T;
    const modelName = getModelName(ctor) as string;
    const id = entity[idKey];
    if (idKey in entity && typeof id === 'string') {
        const savedEntity = getSavedEntity(ctor, id);
        return updateEntity(id, savedEntity, entity, modelName);
    } else {
        return createNewEntity(entity, modelName);
    } 
}

export function createNewEntity(entity: Record<string, unknown>, modelName: string): ModelMessage {
    return {
        operation: 'create',
        modelName,
        payload: {
            entity,
        }
    };
}

export function updateEntity<Id extends string,  Entity extends SavedEntity<Id, unknown>>(
        id: string | symbol, 
        savedEntity: Entity, 
        newEntity:  Record<string, unknown>,
        modelName: string
    ): ModelMessage {
    return {
        operation: 'update',
        modelName,
        payload: {
            id,
            updating: {
                ...getDiff(savedEntity, newEntity)
            }
        }
    };
}

function getDiff<T extends Record<string, unknown>>(oldState: T, newState: T): Partial<T> {
    const keys: Set<keyof T> = new Set(...Object.keys(oldState), ...Object.keys(newState));
    const diff: Partial<T> = {};
    for(const key of keys) {
        if (oldState[key] !== newState[key]) {
            diff[key] = newState[key];
        }
    }

    return diff;
}

function getCtor(entity: Record<string, unknown>): Ctor<unknown> {
    return Object.getPrototypeOf(entity).constructor;
}
