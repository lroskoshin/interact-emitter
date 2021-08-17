import { Ctor } from 'src/decorator';

export const metaKey = Symbol('metainfo');

export type MetaInfo = {
    modelName?: string;
    transport?: string;
    idKey?: string | symbol;
} 

type CtorWithMeta = Ctor<unknown> & {
    [metaKey]?: MetaInfo
}

export function getMetainfo(ctor: CtorWithMeta): MetaInfo | undefined {
    return ctor[metaKey];
}

export function setMetainfo(ctor: CtorWithMeta, metainfo: MetaInfo): void {
    ctor[metaKey] = metainfo;
}
