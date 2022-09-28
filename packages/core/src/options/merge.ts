/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNodeProps, mergeProps } from 'vue';
import {
    isVNodeClassOption,
    isVNodeListenerOption,
    isVNodeOption,
    isVNodePropsOption,
    isVNodeStyleOption,
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
