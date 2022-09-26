/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isReadonly, isRef, unref } from 'vue';
import { MaybeRef } from '../type';

export function unrefWithDefault<T>(value: MaybeRef<T>, alt: NonNullable<T>) : NonNullable<T> {
    const raw = unref(value);
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
    } else {
        input = value;
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
