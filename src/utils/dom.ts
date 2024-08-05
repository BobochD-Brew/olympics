type Nested<T> = void | null | undefined | T | (() => Nested<T>) | Promise<Nested<T>> | Array<Nested<T>>;
type Rec<T> = T | Promise<Rec<T>>;
type Onion = Promise<Rec<void>>;

export type DOM = Nested<HTMLElement>;

export function attach(...childs: DOM[]) {
    return (async (to) => {
        const flat = childs.flat().map(it => typeof it === "function" ? it() : it);
        const async: Promise<any>[] = [];
        const sync = flat.filter(it => !(it instanceof Promise && async.push(it))) as HTMLElement[];
        sync.forEach(child => child && to.appendChild(child));
        if(!async.length) return;
        return Promise
            .all(async)
            .then(it => attach(it.flat()))
            .then(it => it(to));
    }) as (to: HTMLElement) => Onion;
}

export async function full(promise: Rec<any>) {
    let res = promise;
    while(res instanceof Promise) res = await res;
    return res;
} 