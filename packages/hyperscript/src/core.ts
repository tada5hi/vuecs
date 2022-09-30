/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    setDefaults as _setDefaults,
    setPresets as _setPresets,
} from '@vue-layout/core';

import { ComponentsOptions } from './type';

export function setPresets(
    data: Record<string, ComponentsOptions>,
) {
    return _setPresets(data);
}

export function setDefaults(
    data: ComponentsOptions,
) {
    return _setDefaults(data);
}
