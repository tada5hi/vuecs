/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { provide, transformPresetsInput } from '@vue-layout/core';
import { Config } from './type';

export function setConfig(input: Partial<Config>) {
    if (input.presets) {
        provide('presets', transformPresetsInput(input.presets));
    }

    if (input.components) {
        provide('components', input.components);
    }
}
