/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { merge } from 'smob';
import { inject, provide } from '../di';

/**
 * Transform preset.component.option -> component.option.preset.
 *
 * @param input
 */
export function transformPresetsInput(
    input: Record<string, Record<string, any>>,
) {
    const data : Record<string, Record<string, any>> = {};

    const pKeys = Object.keys(input);
    for (let i = 0; i < pKeys.length; i++) {
        const cKeys = Object.keys(input[pKeys[i]]);
        for (let j = 0; j < cKeys.length; j++) {
            if (!Object.prototype.hasOwnProperty.call(data, cKeys[j])) {
                data[cKeys[j]] = {};
            }

            const oKeys = Object.keys(input[pKeys[i]][cKeys[j]]);
            for (let k = 0; k < oKeys.length; k++) {
                if (!Object.prototype.hasOwnProperty.call(data[cKeys[j]], oKeys[k])) {
                    data[cKeys[j]][oKeys[k]] = {};
                }

                data[cKeys[j]][oKeys[k]][pKeys[i]] = input[pKeys[i]][cKeys[j]][oKeys[k]];
            }
        }
    }

    return data;
}

export function setPresets(
    data: Record<string, Record<string, Record<string, any>>>,
    injectionKey?: string,
) {
    const transformedData = transformPresetsInput(data);
    provide(injectionKey || 'presets', transformedData);
}

export function setPreset(
    name: string,
    data: Record<string, Record<string, any>>,
    injectionKey?: string,
) {
    const transformedData = transformPresetsInput({
        [name]: data,
    });

    const presets = usePresets(injectionKey);
    provide(injectionKey || 'presets', merge(presets, transformedData));
}

export function usePresets(injectionKey?: string) : Record<string, Record<string, Record<string, any>>> {
    const data = inject(injectionKey || 'presets');
    if (typeof data === 'undefined') {
        return {};
    }

    return data;
}
