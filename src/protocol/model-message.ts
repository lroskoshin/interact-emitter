export type ModelMessage =  {
    modelName: string;
    operation: 'create',
    payload: {
        entity: Record<string, unknown>,
    }
} | {
    modelName: string;
    operation: 'update',
    payload: {
        id: string | symbol,
        updating: Record<string, unknown>
    }
}
