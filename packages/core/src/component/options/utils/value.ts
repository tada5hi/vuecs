/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from 'smob';
import { hasOwnProperty } from '../../../utils';
import type {
    ComponentOptionConfig, ComponentOptionConfigWithDefaults, ComponentOptionConfigWithPresets,
    ComponentOptionConfigWithValue,
    ComponentOptionInput,
} from '../type';

export function isComponentOptionConfigWithPresets(
    input: unknown,
) : input is ComponentOptionConfigWithPresets<any> {
    if (!isObject(input)) {
        return false;
    }

    const { presets } = input as ComponentOptionConfig<any>;

    if (!isObject(presets)) {
        return false;
    }

    const keys = Object.keys(presets);
    for (let i = 0; i < keys.length; i++) {
        if (
            !hasOwnProperty(presets, keys[i]) ||
            typeof presets[keys[i]] !== 'boolean'
        ) {
            return false;
        }
    }

    return true;
}

export function isComponentOptionConfigWithDefaults(
    input: unknown,
) : input is ComponentOptionConfigWithDefaults<any> {
    if (!isObject(input)) {
        return false;
    }

    const { defaults } = input as ComponentOptionConfig<any>;

    return typeof defaults === 'boolean';
}

export function isComponentOptionConfigWithValue(
    input: unknown,
): input is ComponentOptionConfigWithValue<any> {
    if (!isObject(input)) {
        return false;
    }

    const { value } = input as ComponentOptionConfig<any>;

    return typeof value === 'boolean';
}

export function isComponentOptionConfig(
    value: unknown,
): value is ComponentOptionConfig<any> {
    return isComponentOptionConfigWithPresets(value) ||
        isComponentOptionConfigWithDefaults(value) ||
        isComponentOptionConfigWithValue(value);
}

export function extractValueFromOptionValueInput<V>(input: ComponentOptionInput<V>) : V | undefined {
    if (isComponentOptionConfig(input)) {
        if (input.value) {
            return input.value;
        }

        return undefined;
    }

    return input;
}
