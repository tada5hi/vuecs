/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeProps } from 'vue';
import { mergeProps } from 'vue';

export function isVNodeClassOption(name: string) {
    return name.toLowerCase().indexOf('class') !== -1;
}

export function isVNodeStyleOption(name: string) {
    return name.toLowerCase().indexOf('style') !== -1;
}

export function isVNodeListenerOption(name: string) {
    return name.startsWith('on');
}

export function isVNodePropsOption(name: string) {
    return name.toLowerCase().indexOf('props') !== -1;
}

export function isVNodeOption(name: string) {
    return isVNodeClassOption(name) ||
        isVNodeStyleOption(name) ||
        isVNodeListenerOption(name) ||
        isVNodePropsOption(name);
}

export function mergeVNodeOption<T>(key: string, target: T, source: T): T {
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
