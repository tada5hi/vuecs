/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { useDefaults } from '../../defaults';
import { usePresets } from '../../preset';
import { hasOwnProperty } from '../../utils';

export function getGlobalPresetsOptionValue(
    component: string,
    option: string,
    injectionKey?: string,
): Record<string, any> {
    const input = usePresets(injectionKey);

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
    const { [component]: componentOptions } = useDefaults(injectionKey);

    if (
        typeof componentOptions === 'object' &&
        hasOwnProperty(componentOptions, option)
    ) {
        return componentOptions[option];
    }

    return undefined;
}
