export const savedEntityKey = Symbol('savedEntity');

export type SavedEntity<Id extends string | symbol, P> = {
    [key in Id]: string;
} & {
    [savedEntityKey]: P
} & P;
