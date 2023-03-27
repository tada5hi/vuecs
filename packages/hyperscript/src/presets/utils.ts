/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ComponentsOptions } from '../type';
import { bootstrapV4 } from './bootstrap-v4';
import { bootstrapV5 } from './bootstrap-v5';
import { PresetsBuildIn } from './constatns';
import { fontAwesome } from './font-awesome';

export function getBuildInPresets(input: `${PresetsBuildIn}`[]) {
    const presets : Record<string, ComponentsOptions> = {};

    for (let i = 0; i < input.length; i++) {
        switch (input[i]) {
            case PresetsBuildIn.BOOTSTRAP_V4:
                presets.bootstrapV4 = bootstrapV4;
                break;
            case PresetsBuildIn.BOOTSTRAP_V5:
                presets.bootstrapV5 = bootstrapV5;
                break;
            case PresetsBuildIn.FONT_AWESOME:
                presets.fontAwesome = fontAwesome;
                break;
        }
    }

    return presets;
}
