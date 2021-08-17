import { ModelMessage } from '../src/protocol/model-message';
import { ModelQuery } from '../src/protocol/model-query';
import { Result, Status } from '../src/protocol/result';
import { Transport } from '../src/protocol/transport';

export class FakeTransport implements Transport {
    constructor(private fn: (...args: any[]) => void) {

    }
    async push(message: ModelMessage): Promise<Result<unknown>> {
        this.fn(message);
        return {
            status: Status.Success,
            payload: 'ok'
        };
    }
    async pull<T>(query: ModelQuery<T, keyof T, T[keyof T]>): Promise<Result<T[]>> {
        this.fn(query);
        return {
            status: Status.Success,
            payload: []
        };
    }
}
