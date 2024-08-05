
const contextStack: any[] = [];

export function createSignal<T>(defaultValue: T): [() => T, (arg: T) => void] {

    const subscribers = new Set<Function>();
    let value = defaultValue;

    const get = () => {
        const context = contextStack[contextStack.length - 1];
        if(context) subscribers.add(context);
        return value;
    }

    const set = (_value: T) => {
        value = _value;
        subscribers.forEach(it => it());
    }

    return [ get, set ];
}

export function useEffect(callback: () => void) {
    contextStack.push(callback);
    callback();
    contextStack.pop();
}