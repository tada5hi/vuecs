/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from '../../utils';
import {
    OptionValueConfig, OptionValueInput,
} from '../type';

export function isOptionValueConfig(
    value: unknown,
): value is OptionValueConfig<any> {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    return hasOwnProperty(value, '__vl__isOptionValueConfig') &&
        hasOwnProperty(value, 'value');
}

export function extractValueFromOptionValueInput<V>(input: OptionValueInput<V>) : V {
    if (isOptionValueConfig(input)) {
        return input.value;
    }

    return input;
}
