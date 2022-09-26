/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MakeOptional } from '../type';

export type PresetOption<V> = {
    value: V,
    enabled: boolean
};

export type OptionValueConfig<V> = {
    value: V,
    preset?: {
        [key: string]: MakeOptional<
        PresetOption<V>,
        'value' | 'enabled'
        >
    }
};

export type OptionValueBuildContext<O, V> = {
    component: string,
    key: O,
    alt?: V,
    value?: V | PresetOption<V>,
    preset?: {
        [key: string]: MakeOptional<
        PresetOption<V>,
        'value' | 'enabled'
        >
    }
};
