import { createNewEntity, updateEntity } from './model/save';
import { SavedEntity } from './model/saved-entity';
import { Result } from './protocol/result';
import { Transport } from './protocol/transport';


export abstract class RemoteModel {
    public static remoteId = '';
    public static ctor = RemoteModel;
    public abstract id?: string;
    private static transport?: Transport;
    
    public static setTransport(transport?: Transport): void {
        this.ctor.transport = transport;
    }

    public static getTransport(): Transport | undefined {
        return this.ctor.transport ?? RemoteModel.transport;
    }

    public static async save<T extends RemoteModel>(entity: T): Promise<Result> {
        const transport = ensureDefined(this.transport);
        if(entity.id !== undefined) {
            return transport.push(this.update(entity));
        } else {
            return transport.push(this.create(entity));
        }
    }
    private static create<T extends RemoteModel>(entity: T) {
        return createNewEntity(entity as Record<string, unknown>, this.remoteId);
    }
    private static update<T extends RemoteModel>(entity: T) {
        return updateEntity('id', {} ,entity as SavedEntity<'id'>, this.remoteId);
    }
    public static find<T extends RemoteModel>(entity: T) {
        return; 
    }
    public static delete<T extends RemoteModel>(entity: T) {
        return; 
    }
}

export function RemoteId(id: string) {
    return <C extends typeof RemoteModel>(arg: C): C => {
        arg.remoteId = id;
        arg.ctor = arg;
        return arg;
    }; 
}

function ensureDefined<T>(val: T | undefined): T {
    if (val !== undefined) {
        return val;
    }
    throw new Error('ensuring value is undefined');
}
