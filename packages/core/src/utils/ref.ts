/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { merge } from 'smob';
import { isReadonly, isRef, unref } from 'vue';
import type { MaybeRef } from 'vue';

export function unrefWithDefault<T>(value: MaybeRef<T>, alt: NonNullable<T>) : NonNullable<T> {
    const raw : T = unref(value);
    if (typeof raw === 'undefined') {
        return alt as NonNullable<T>;
    }

    return raw as NonNullable<T>;
}

export function setMaybeRefValue<T>(input: MaybeRef<T>, value: T) {
    if (isRef(input)) {
        if (!isReadonly(input)) {
            input.value = value;
        }

        return input;
    }

    input = value;

    return input;
}

export function extendMaybeRefObject<T extends Record<string, any>>(
    input: MaybeRef<T>,
    value: Partial<T>,
) {
    const keys = Object.keys(value) as (keyof T)[];

    if (isRef(input)) {
        if (!isReadonly(input)) {
            for (let i = 0; i < keys.length; i++) {
                input.value[keys[i] as keyof T] = value[keys[i]] as T[keyof T];
            }
        }
    } else {
        for (let i = 0; i < keys.length; i++) {
            input[keys[i] as keyof T] = value[keys[i]] as T[keyof T];
        }
    }

    return input;
}

export function pushMaybeRefArrayValue<T>(
    input: MaybeRef<T[]>,
    value: T,
) {
    if (isRef(input)) {
        input.value.push(value);
    } else {
        input.push(value);
    }

    return value;
}

export function spliceMaybeRefArray<T extends unknown[]>(
    input: MaybeRef<T>,
    index: number,
    amount: number,
) {
    if (isRef(input)) {
        input.value.splice(index, amount);
    } else {
        input.splice(index, amount);
    }

    return input;
}

export function getMaybeRefArrayValue<T>(
    input: MaybeRef<T[]>,
    index: number,
) {
    if (isRef(input)) {
        return input.value[index];
    }

    return input[index];
}

export function extendMaybeRefArrayValue<T extends Record<string, any>>(
    input: MaybeRef<T[]>,
    index: number,
    value: T,
) {
    const item : T = getMaybeRefArrayValue(input, index);

    if (isRef(input)) {
        input.value[index] = merge(value, item) as T;
    } else {
        input[index] = merge(value, item) as T;
    }

    return input;
}

export function findIndexOfMaybeRefArray<T>(
    input: MaybeRef<T[]>,
    filterFn: (item: T, index?: number) => boolean,
) {
    if (isRef(input)) {
        return input.value.findIndex(filterFn);
    }

    return input.findIndex(filterFn);
}
