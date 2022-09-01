/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, ComponentOptions } from '../../options';
import { useConfig } from '../module';
import { hasOwnProperty } from '../../utils';
import { LibraryConfig } from '../../type';

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

    if (!config.library) {
        return undefined;
    }

    if (
        config.library[library] &&
        typeof config.library[library].options !== 'undefined' &&
        (config.library[library] as LibraryConfig).options![component]
    ) {
        return ((config.library[library] as LibraryConfig).options![component] as ComponentOptions<C>)[key];
    }

    return undefined;
}

export function hasConfigLibraryComponentOption
<C extends Component | `${Component}`>(library: string, component: C, key: keyof ComponentOptions<C>) {
    const config = useConfig();

    return config.library &&
        config.library[library] &&
        config.library[library].options &&
        (config.library[library] as LibraryConfig).options![component] &&
        hasOwnProperty(((config.library[library] as LibraryConfig).options![component] as ComponentOptions<C>), key);
}
