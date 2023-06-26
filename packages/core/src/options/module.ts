/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useDefaultsStore } from '../defaults';
import { getRegisteredPresets, usePresetStore } from '../preset';
import { hasOwnProperty } from '../utils';
import type {
    OptionBuildContext,
} from './type';
import {
    isOptionInputConfig,
    isOptionInputConfigWithDefaults,
    isOptionInputConfigWithPresets,
    mergeOption,
} from './utils';

function buildOption<
    O extends Record<string, any>,
    K extends keyof O,
>(context: OptionBuildContext<K, O[K]>) : O[K] | undefined {
    let value : O[K] | undefined;

    const presetConfig : Record<string, boolean> = {};

    if (isOptionInputConfigWithPresets(context.value)) {
        const keys = Object.keys(context.value.presets);
        for (let i = 0; i < keys.length; i++) {
            presetConfig[keys[i]] = context.value.presets[keys[i]];
        }

        if (typeof context.value.value !== 'undefined') {
            value = context.value.value;
        }
    }

    if (!isOptionInputConfig(context.value)) {
        value = context.value;
    }

    if (typeof value === 'undefined') {
        if (!isOptionInputConfigWithDefaults(context.value) || context.value.defaults) {
            const defaultStore = useDefaultsStore();
            if (defaultStore.hasOption(context.component, context.key as string)) {
                value = defaultStore.getOption(context.component, context.key as string);
            }
        }
    }

    const registeredPresets = getRegisteredPresets();
    for (let i = 0; i < registeredPresets.length; i++) {
        if (
            hasOwnProperty(presetConfig, registeredPresets[i]) &&
            !presetConfig[registeredPresets[i]]
        ) {
            continue;
        }

        const presetStore = usePresetStore(registeredPresets[i]);
        if (presetStore.hasOption(context.component, context.key as string)) {
            value = mergeOption(
                context.key as string,
                value,
                presetStore.getOption(context.component, context.key as string),
            );
        }
    }

    if (typeof value === 'undefined') {
        return context.alt;
    }

    return value;
}

function buildOptionOrFail<
    O extends Record<string, any>,
    K extends keyof O = keyof O,
    >(context: OptionBuildContext<K, O[K]>) : O[K] {
    const target = buildOption(context);

    if (
        typeof target === 'undefined' &&
        !hasOwnProperty(context, 'alt')
    ) {
        throw new Error(`A value for option ${context.key as string} of component ${context.component} is required.`);
    }

    return target as O[K];
}

export function createOptionBuilder<O extends Record<string, any>>(
    component: string,
) {
    const build = <K extends keyof O>(
        context: Omit<OptionBuildContext<K, O[K]>, 'component'>,
    ) : O[K] | undefined => buildOption({
            ...context,
            component,
        });

    const buildOrFail = <K extends keyof O>(
        context: Omit<OptionBuildContext<K, O[K]>, 'component'>,
    ) : O[K] => buildOptionOrFail({
            ...context,
            component,
        });

    return {
        build,
        buildOrFail,
    };
}
