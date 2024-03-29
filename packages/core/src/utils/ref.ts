import { isObject, merge } from 'smob';
import {
    isReadonly, isRef, unref,
} from 'vue';
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
    }
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

export function extendMaybeRefArrayValue<T>(
    input: MaybeRef<T[]>,
    index: number,
    value: T,
) {
    if (
        !isObject(value) &&
        !Array.isArray(value)
    ) {
        return input;
    }

    const item : T = getMaybeRefArrayValue(input, index);

    if (
        isObject(item) ||
        Array.isArray(item)
    ) {
        if (isRef(input)) {
            input.value[index] = merge(value, item) as T;
        } else {
            input[index] = merge(value, item) as T;
        }
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
