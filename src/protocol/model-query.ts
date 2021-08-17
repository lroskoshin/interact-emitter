export type ModelQuery<P, N extends keyof P, V = P[N]> = {
    modelName: string;
    operation: 'find' | 'findOne';
    payload: {
        fields: readonly FieldsQuery<N, V>[];
    }
}

export type FieldsQuery<Name extends string | number | symbol, Value extends unknown> = {
    readonly name: Name;
    readonly value: Value; 
}
