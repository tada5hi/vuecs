/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from '../../../utils';
import type {
    OptionValueConfig, OptionValueInput,
} from '../type';

export function isOptionValueConfig(
    value: unknown,
): value is OptionValueConfig<any> {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    if (!hasOwnProperty(value, 'presets') || !hasOwnProperty(value, 'value')) {
        return false;
    }

    if (typeof value.presets !== 'object' || value.presets === null) {
        return false;
    }

    const keys = Object.keys(value.presets);
    for (let i = 0; i < keys.length; i++) {
        if (
            !hasOwnProperty(value.presets, keys[i]) ||
            typeof value.presets[keys[i]] !== 'boolean'
        ) {
            return false;
        }
    }

    return true;
}

export function extractValueFromOptionValueInput<V>(input: OptionValueInput<V>) : V {
    if (isOptionValueConfig(input)) {
        return input.value;
    }

    return input;
}
