/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import { useDefaultComponentStore } from '../defaults';
import { getRegisteredPresets, usePresetComponentStore } from '../preset';
import { hasOwnProperty } from '../../utils';
import {
    isOptionValueConfig,
    mergeOption,
} from './utils';
import type { OptionValueBuildContext, OptionValueBuilder } from './type';

export function buildOptionValue<
    O extends Record<string, any>,
    K extends keyof O,
>(context: OptionValueBuildContext<K, O[K]>) : O[K] | undefined {
    let value : O[K] | undefined;

    const presetConfig : Record<string, boolean> = {};

    if (isOptionValueConfig(context.value)) {
        value = unref(context.value.value);

        if (context.value.presets) {
            const keys = Object.keys(context.value.presets);
            for (let i = 0; i < keys.length; i++) {
                presetConfig[keys[i]] = context.value.presets[keys[i]];
            }
        }
    } else {
        value = unref(context.value) as O[K];
    }

    if (typeof value === 'undefined') {
        const defaultStore = useDefaultComponentStore();
        if (defaultStore.hasOption(context.component, context.key as string)) {
            value = defaultStore.getOption(context.component, context.key as string);
        }
    }

    if (typeof value === 'undefined') {
        value = context.alt;
    }

    if (typeof value === 'undefined') {
        return undefined;
    }

    const registeredPresets = getRegisteredPresets();
    for (let i = 0; i < registeredPresets.length; i++) {
        if (
            hasOwnProperty(presetConfig, registeredPresets[i]) &&
            !presetConfig[registeredPresets[i]]
        ) {
            continue;
        }

        const presetStore = usePresetComponentStore(registeredPresets[i]);
        if (presetStore.hasOption(context.component, context.key as string)) {
            value = mergeOption(
                context.key as string,
                value,
                presetStore.getOption(context.component, context.key as string),
            );
        }
    }

    return value;
}

export function buildOptionValueOrFail<
    O extends Record<string, any>,
    K extends keyof O = keyof O,
    >(context: OptionValueBuildContext<K, O[K]>) : O[K] {
    const target = buildOptionValue(context);

    if (typeof target === 'undefined') {
        throw new Error(`A value for option ${context.key as string} of component ${context.component} is required.`);
    }

    return target as O[K];
}

export function createOptionValueBuilderForComponent<O extends Record<string, any>>(
    component: string,
) : OptionValueBuilder<O> {
    return {
        build: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component'>,
        ) : O[K] | undefined => buildOptionValue({
            ...context,
            component,
        }),
        buildOrFail: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component'>,
        ) : O[K] => buildOptionValueOrFail({
            ...context,
            component,
        }),
    };
}
