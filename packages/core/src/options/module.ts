/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import type { InjectionKeys } from '../type';
import { hasOwnProperty } from '../utils';
import {
    getGlobalComponentOptionValue,
    getGlobalPresetsOptionValue,
    isOptionValueConfig,
    mergeOption,
} from './utils';
import type { OptionValueBuildContext, OptionValueBuilder } from './type';

export function buildOptionValue<
    O extends Record<string, any>,
    K extends keyof O,
>(context: OptionValueBuildContext<K, O[K] | undefined>) : O[K] | undefined {
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

    const {
        components: componentsInjectionKey,
        presets: presetsInjectionKey,
    } = context.injectionKeys || {};

    const configValue = getGlobalComponentOptionValue(
        context.component,
        context.key as string,
        componentsInjectionKey,
    ) as O[K];

    if (typeof value === 'undefined') {
        value = configValue;
    }

    if (typeof value === 'undefined') {
        value = context.alt;
    }

    if (typeof value === 'undefined') {
        return undefined;
    }

    const presetsValue = getGlobalPresetsOptionValue(
        context.component,
        context.key as string,
        presetsInjectionKey,
    );
    const presetsKeys = Object.keys(presetsValue);
    for (let i = 0; i < presetsKeys.length; i++) {
        if (
            !hasOwnProperty(presetConfig, presetsKeys[i]) ||
            presetConfig[presetsKeys[i]]
        ) {
            value = mergeOption(
                context.key as string,
                value,
                presetsValue[presetsKeys[i]],
            );
        }
    }

    return value;
}

export function buildOptionValueOrFail<
    O extends Record<string, any>,
    K extends keyof O = keyof O,
    >(context: OptionValueBuildContext<K, O[K] | undefined>) : O[K] {
    const target = buildOptionValue(context);

    if (typeof target === 'undefined') {
        throw new Error(`A value for option ${context.key as string} of component ${context.component} is required.`);
    }

    return target as O[K];
}

export function createOptionValueBuilderForComponent<O extends Record<string, any>>(
    component: string,
    injectionKeys?: InjectionKeys,
) : OptionValueBuilder<O> {
    return {
        build: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component' | 'injectionKeys'>,
        ) : O[K] | undefined => buildOptionValue({
            ...context,
            component,
            ...(injectionKeys ? { injectionKeys } : {}),
        }),
        buildOrFail: <K extends keyof O>(
            context: Omit<OptionValueBuildContext<K, O[K]>, 'component' | 'injectionKeys'>,
        ) : O[K] => buildOptionValueOrFail({
            ...context,
            component,
            ...(injectionKeys ? { injectionKeys } : {}),
        }),
    };
}
