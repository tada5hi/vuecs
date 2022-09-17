/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, ComponentOptions } from '../../options';
import { useConfig } from '../module';
import { hasOwnProperty } from '../../utils';
import { PresetConfig } from '../../type';

export function getConfigComponentOption
<C extends Component | `${Component}`, K extends keyof ComponentOptions<C>>(component: C, key: K) : ComponentOptions<C>[K] | undefined {
    const config = useConfig();

    if (!config.component) {
        return undefined;
    }

    if (config.component[component]) {
        return (config.component[component] as Record<string, any>)[key as string];
    }

    return undefined;
}

export function hasConfigComponentOption
<C extends Component | `${Component}`>(component: C, key: keyof ComponentOptions<C>) {
    const config = useConfig();

    return config.component &&
        config.component[component] &&
        hasOwnProperty((config.component[component] as Record<string, any>), key);
}

export function getConfigLibraryComponentOption
<C extends Component | `${Component}`, K extends keyof ComponentOptions<C>>(library: string, component: C, key: K) : ComponentOptions<C>[K] | undefined {
    const config = useConfig();

    if (!config.preset) {
        return undefined;
    }

    if (
        config.preset[library] &&
        typeof config.preset[library].options !== 'undefined' &&
        (config.preset[library] as PresetConfig).options![component]
    ) {
        return ((config.preset[library] as PresetConfig).options![component] as ComponentOptions<C>)[key];
    }

    return undefined;
}

export function hasConfigLibraryComponentOption
<C extends Component | `${Component}`>(library: string, component: C, key: keyof ComponentOptions<C>) {
    const config = useConfig();

    return config.preset &&
        config.preset[library] &&
        config.preset[library].options &&
        (config.preset[library] as PresetConfig).options![component] &&
        hasOwnProperty(((config.preset[library] as PresetConfig).options![component] as ComponentOptions<C>), key);
}
