import {hello} from '../src/index';

describe('Hello', () => {
    it('should be hello world', () => {
        expect(hello()).toEqual('hello world');
    });
});
