/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PresetOption } from './type';

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

export function extendPresetOption<V>(value: PresetOption<V>) : PresetOption<V> {
    return {
        value: value.value,
        enabled: value.enabled || typeof value !== 'undefined',
    };
}
