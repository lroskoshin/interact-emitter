import { Ctor } from '../decorator';
import { FieldsQuery, ModelQuery } from '../protocol/model-query';
import { Status } from '../protocol/result';
import { ensureModelName } from './model';
import { SavedEntity, savedEntityKey } from './saved-entity';
import { ensureTransport } from './transports';

const savedEntities = new Map<Ctor<unknown>, Map<string, Record<string, unknown>>>();

export function getSavedEntity(ctor: Ctor<unknown>, id: string): SavedEntity<typeof id, unknown> {
    const entitiesByCtor = savedEntities.get(ctor) as Map<string, Record<string, unknown>>;
    return entitiesByCtor.get(id) as SavedEntity<typeof id, unknown>;
}

export async function find<P, K extends keyof P>(ctor: Ctor<P>, fields: readonly FieldsQuery<K, P[K]>[]): Promise<P[]> {
    const modelQuery = getModelQuery(ctor, fields);
    const transport = ensureTransport(ctor);
    const result = await transport.pull(modelQuery);

    if (result.status === Status.Success) {
        return transformToClass(ctor, result.payload);
    } else {
        throw result.error;
    }
}

function transformToClass<P>(ctor: Ctor<P>, entities: P[]): SavedEntity<string, P>[] {
    const result = [];
    for (let index = 0; index < entities.length; index++) {
        const entity =  entities[index];
        const instance: SavedEntity<string, P> = Object.assign(new ctor(), {
            [savedEntityKey]: entity
        });

        Object.assign(instance, entity);
        result.push(instance);
    }
    return result;
}

export function getModelQuery<P, K extends keyof P>(ctor: Ctor<P>, fields: readonly FieldsQuery<K, P[K]>[]): ModelQuery<P, K> {
    const modelName = ensureModelName(ctor);
    
    return {
        modelName,
        operation: 'find',
        payload: {
            fields
        }
    };
}
