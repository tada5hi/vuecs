/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component, ComponentOptions } from '../../options';
import { useConfig } from '../module';
import { hasOwnProperty } from '../../utils';
import { PresetConfigOptions } from '../../type';

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

export function getConfigPresetComponentOption
<C extends Component | `${Component}`, K extends keyof ComponentOptions<C>>(
    preset: string,
    component: C,
    key: K,
) : ComponentOptions<C>[K] | undefined {
    const config = useConfig();

    if (
        !config.preset ||
        !config.preset[preset] ||
        !config.preset[preset].options
    ) {
        return undefined;
    }

    const { options } = config.preset[preset] as { options: PresetConfigOptions };
    if (typeof options[component] === 'undefined') {
        return undefined;
    }

    const optionsComponent = options[component] as Partial<ComponentOptions<C>>;
    if (!hasOwnProperty(optionsComponent, key)) {
        return undefined;
    }

    return optionsComponent[key] as ComponentOptions<C>[K];
}
