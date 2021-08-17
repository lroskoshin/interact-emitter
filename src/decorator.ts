export type Ctor<Prototype> = {
    new(): Prototype;
    prototype: Prototype;
};


export type Decorator = <Prototype>(arg: Ctor<Prototype>) => Ctor<Prototype>;
