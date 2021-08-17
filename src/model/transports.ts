import { Ctor } from '../decorator';
import { Transport } from '../protocol/transport';

export const transports = new Map<Ctor<unknown>, Transport>();

export function setTransport(ctor: Ctor<unknown>, transport: Transport): void {
    transports.set(ctor, transport);
}

export function getTransport(ctor: Ctor<unknown>): Transport | undefined {
    return transports.get(ctor); 
}

export function ensureTransport(ctor: Ctor<unknown>): Transport {
    const transport = getTransport(ctor);
    if(transport === undefined) {
        throw new Error('Model has not transport');
    }

    return transport;
}
