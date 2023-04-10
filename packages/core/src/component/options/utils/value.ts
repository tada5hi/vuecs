/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from 'smob';
import { hasOwnProperty } from '../../../utils';
import type {
    OptionValueConfig, OptionValueInput,
} from '../type';

export function isOptionValueConfig(
    value: unknown,
): value is OptionValueConfig<any> {
    if (!isObject(value)) {
        return false;
    }

    if (!hasOwnProperty(value, 'value')) {
        return false;
    }

    if (
        typeof (value as OptionValueConfig<any>).presets === 'undefined' &&
        typeof (value as OptionValueConfig<any>).defaults === 'undefined'
    ) {
        return false;
    }

    if (typeof (value as OptionValueConfig<any>).presets !== 'undefined') {
        const { presets } = value as OptionValueConfig<any>;
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
    }

    return !(typeof (value as OptionValueConfig<any>).defaults !== 'undefined' &&
        typeof (value as OptionValueConfig<any>).defaults !== 'boolean');
}

export function extractValueFromOptionValueInput<V>(input: OptionValueInput<V>) : V {
    if (isOptionValueConfig(input)) {
        return input.value;
    }

    return input;
}
