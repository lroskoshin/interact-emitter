import { Model } from '../src/index';
import { find } from '../src/model/find';
import { getIdKey, getModelName, Id } from '../src/model/model';
import { save } from '../src/model/save';
import { setTransport } from '../src/model/transports';
import { ModelMessage } from '../src/protocol/model-message';
import { ModelQuery } from '../src/protocol/model-query';
import { FakeTransport } from './fake-transport';

describe('Mdoel', () => {
    const modelName = 'hello';

    @Model('hello')
    class A {
        @Id()
        public id?: string;
        public prop = '';
    }

    const mockFetch = jest.fn((arg: ModelQuery<A, keyof A> | ModelMessage) => arg);

    beforeAll(() => {
        setTransport(A, new FakeTransport(mockFetch));
    });

    it('should be model', () => {
        expect(getModelName(A)).toEqual('hello');
        expect(getIdKey(A)).toEqual('id');
    });
    
    it('create', () => {
        const a = new A();
        a.prop = 'value';
        save(a);
    });

    it('find', async () => {
        const fields = [
            {
                name: 'prop',
                value: 'value'
            }
        ] as const;

        await find(A, fields);

        expect(mockFetch).toHaveBeenLastCalledWith({
            modelName,
            operation: 'find',
            payload: {
                fields,
            }
        });
    });
});
