type Fn<T> = (...args: any[]) => T;
type FnOrValue<T> = Fn<T> | T;

export function evaluateFnOrValue<T extends FnOrValue<any>>(
    input: T,
    ...args: T extends Fn<any> ? Parameters<T> : undefined[]
) : T extends FnOrValue<infer U> ? U : never {
    if (typeof input === 'function') {
        return input(...args);
    }

    return input as any;
}
