/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

type FnOrValue<T> = ((...args: any[]) => T) | T;

export function evaluateFnOrValue<T extends FnOrValue<any>>(
    input: T,
    ...args: any[]
) : T extends FnOrValue<infer U> ? U : never {
    if (typeof input === 'function') {
        return input(...args);
    }

    return input as any;
}
