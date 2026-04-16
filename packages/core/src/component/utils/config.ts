import { isObject } from 'smob';
import { hasOwnProperty } from '../../utils';
import type {
    ComponentOptionInputConfig,
    ComponentOptionInputConfigWithDefaults,
    ComponentOptionInputConfigWithPresets,
} from '../type';

export function isComponentOptionInputConfigWithPresets(
    input: unknown,
) : input is ComponentOptionInputConfigWithPresets<any> {
    if (!isObject(input)) {
        return false;
    }

    const { presets } = input as ComponentOptionInputConfig<any>;

    if (!isObject(presets)) {
        return false;
    }

    const keys = Object.keys(presets);
    for (const key of keys) {
        if (
            !hasOwnProperty(presets, key) ||
            typeof presets[key] !== 'boolean'
        ) {
            return false;
        }
    }

    return true;
}

export function isComponentOptionInputConfigWithDefaults(
    input: unknown,
) : input is ComponentOptionInputConfigWithDefaults<any> {
    if (!isObject(input)) {
        return false;
    }

    const { defaults } = input as ComponentOptionInputConfig<any>;

    return typeof defaults === 'boolean';
}
export function isComponentOptionInputConfig(
    value: unknown,
): value is ComponentOptionInputConfig<any> {
    return isComponentOptionInputConfigWithPresets(value) ||
        isComponentOptionInputConfigWithDefaults(value);
}
