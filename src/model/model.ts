import { Ctor, Decorator } from '../decorator';
import { getMetainfo, setMetainfo } from './metainfo';

export function Model(name: string): Decorator {
    return <Prototype>(ctor: Ctor<Prototype>): Ctor<Prototype> => {
        const meta = getMetainfo(ctor) ?? {};
        
        setMetainfo(ctor, Object.assign(meta, {
            modelName: name
        }));

        return ctor;
    };
}

export function getModelName(ctor: Ctor<unknown>): string | undefined {
    return getMetainfo(ctor)?.modelName;
}

export function ensureModelName(ctor: Ctor<unknown>): string {
    const modelName = getModelName(ctor);
    if (modelName === undefined) {
        throw new Error('Model has not name');
    }

    return modelName;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function Id(): (target: Object, propertyKey: string) => void {
    return (target: unknown, propertyKey: string): void => {
        const ctor = (target as { constructor: Ctor<unknown> }).constructor;
        const meta = getMetainfo(ctor);
        if (meta === undefined) {
            setMetainfo(ctor, {
                idKey: propertyKey,
            });
        } else {
            meta.idKey = propertyKey;
        }
    };
}

export function getIdKey(ctor: Ctor<unknown>): string | undefined {
    return getMetainfo(ctor)?.idKey;
}
