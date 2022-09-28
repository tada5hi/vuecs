/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { OptionValueConfig } from './type';
import { hasOwnProperty } from '../utils';

export function isOptionValueConfig(
    value: unknown,
) : value is OptionValueConfig<any> {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    if (!hasOwnProperty(value, 'value')) {
        return false;
    }

    return !(hasOwnProperty(value, 'preset') &&
        (typeof value.preset !== 'object' || value.preset === null));
}
