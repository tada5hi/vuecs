/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from 'smob';
import type { MaybeRef } from 'vue';
import { isRef } from 'vue';
import { hasOwnProperty } from '../../../utils';
import type {
    OptionInputConfig,
    OptionInputConfigWithDefaults,
    OptionInputConfigWithPresets,
    OptionInputValue,
} from '../type';

export function isOptionInputConfigWithPresets(
    input: unknown,
) : input is OptionInputConfigWithPresets<any> {
    if (!isObject(input)) {
        return false;
    }

    const { presets } = input as OptionInputConfig<any>;

    if (!isObject(presets)) {
        return false;
    }

    const keys = Object.keys(presets);
    for (let i = 0; i < keys.length; i++) {
        if (
            !hasOwnProperty(presets, keys[i]) ||
            typeof presets[keys[i]] !== 'boolean'
        ) {
            return false;
        }
    }

    return true;
}

export function isOptionInputConfigWithDefaults(
    input: unknown,
) : input is OptionInputConfigWithDefaults<any> {
    if (!isObject(input)) {
        return false;
    }

    const { defaults } = input as OptionInputConfig<any>;

    return typeof defaults === 'boolean';
}
export function isOptionInputConfig(
    value: unknown,
): value is OptionInputConfig<any> {
    return isOptionInputConfigWithPresets(value) ||
        isOptionInputConfigWithDefaults(value);
}

export function extractValueFromOptionInputValue<V>(input: OptionInputValue<V>) : V | undefined {
    if (isOptionInputConfig(input)) {
        if (input.value) {
            return input.value;
        }

        return undefined;
    }

    return input;
}
