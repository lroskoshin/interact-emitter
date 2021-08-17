export const enum Status {
    Success,
    Failed
}

export type Success<Payload> = {
    status: Status.Success;
    payload: Payload;
}

export type Fail = {
    status: Status.Failed;
    error: string;
}

export type Result<Payload> = Success<Payload> | Fail
