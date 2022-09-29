/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { inject } from '../../di';
import { hasOwnProperty } from '../../utils';

export function getGlobalPresetsOptionValue(
    component: string,
    option: string,
    injectionKey?: string,
): Record<string, any> {
    const input = {
        ...inject(injectionKey || 'presets') ?? {},
    } as Record<string, Record<string, any>>;

    if (!hasOwnProperty(input, component)) {
        return {};
    }

    if (!hasOwnProperty(input[component], option)) {
        return {};
    }

    return input[component][option];
}

export function getGlobalComponentOptionValue<V>(
    component: string,
    option: string,
    injectionKey?: string,
): V | undefined {
    const { [component]: componentOptions } = {
        ...inject(injectionKey || 'components') ?? {},
    };

    if (
        typeof componentOptions === 'object' &&
        hasOwnProperty(componentOptions, option)
    ) {
        return componentOptions[option];
    }

    return undefined;
}
