/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNodeProps, mergeProps } from 'vue';
import {
    isVNodeClassOption, isVNodeListenerOption, isVNodeOption, isVNodePropsOption, isVNodeStyleOption,
} from './utils';

function isObject(item: any): item is Record<string, any> {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeVNodeOption<T>(key: string, target: T, source: T) : T {
    if (typeof target === 'undefined') {
        return source;
    }

    if (typeof source === 'undefined') {
        return target;
    }

    if (isVNodeClassOption(key)) {
        const { class: clazz } = mergeProps(
            { class: target },
            { class: source },
        );

        return clazz as T;
    }

    if (isVNodeStyleOption(key)) {
        const { style } = mergeProps(
            { style: target },
            { style: source },
        );

        return style as T;
    }

    if (isVNodeListenerOption(key)) {
        const { [key]: listener } = mergeProps(
            { [key]: target },
            { [key]: source },
        );

        return listener as T;
    }

    if (isVNodePropsOption(key)) {
        return mergeProps(target as VNodeProps, source as VNodeProps) as T;
    }

    return target ?? source;
}

export function mergeOption<T>(key: string, target: T, source: T) : T {
    if (isVNodeOption(key)) {
        return mergeVNodeOption(key, target, source);
    }

    if (isObject(key) && isObject(source)) {
        return {
            ...source,
            ...target,
        } as T;
    }

    return target ?? source;
}

export function mergeOptions<A extends Record<string, any>, B extends Record<string, any>>(target: A, ...sources: B[]): A & B {
    if (!sources.length) return target as A & B;

    const source = sources.shift();

    if (
        isObject(target) &&
        isObject(source)
    ) {
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            if (isObject(source[keys[i]])) {
                if (!target[keys[i]]) Object.assign(target, { [keys[i]]: {} });

                mergeOptions(target[keys[i]], source[keys[i]]);
            } else if (isVNodeOption(keys[i])) {
                target[keys[i] as keyof A] = mergeVNodeOption(keys[i], target[keys[i]], source[keys[i]]) as A[keyof A];
            } else if (!target[keys[i]]) {
                Object.assign(target, { [keys[i]]: source[keys[i]] });
            }
        }
    }

    return mergeOptions(target, ...sources);
}
