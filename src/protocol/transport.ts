import { ModelMessage } from './model-message';
import { ModelQuery } from './model-query';
import { Result } from './result';

export interface Transport {
    push(message: ModelMessage): Promise<Result<unknown>>;
    pull<T>(query: ModelQuery<T, keyof T>): Promise<Result<T[]>>;
}
