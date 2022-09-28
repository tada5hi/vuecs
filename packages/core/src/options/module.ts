/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { inject } from '../di';
import { MakeOptional } from '../type';
import { isOptionValueConfig } from './check';
import { OptionValueBuildContext, OptionValueConfig, PresetOption } from './type';
import { mergeOption } from './merge';
import { hasOwnProperty } from '../utils';

function getGlobalComponentOption<V>(
    component: string,
    key: string,
) : OptionValueConfig<V> | undefined {
    const { [component]: componentOptions } = {
        ...inject('component') ?? {},
    };

    if (
        typeof componentOptions === 'object' &&
        hasOwnProperty(componentOptions, key)
    ) {
        return componentOptions[key];
    }

    return undefined;
}

function mergePreset<V>(
    target: Record<string, MakeOptional<PresetOption<V>, 'value' | 'enabled'>>,
    source: Record<string, MakeOptional<PresetOption<V>, 'value' | 'enabled'>>,
) {
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i++) {
        // if boolean false <-- disable preset for default preset value
        if (hasOwnProperty(target, keys[i])) {
            if (typeof target[keys[i]].value === 'undefined') {
                target[keys[i]].value = source[keys[i]].value as V;
            }

            if (
                typeof target[keys[i]].enabled === 'undefined' &&
                    typeof source[keys[i]].enabled !== 'undefined'
            ) {
                target[keys[i]].enabled = source[keys[i]].enabled as boolean;
            }
        }
    }

    return target;
}

export function buildOptionValue<
    O extends Record<string, any>,
    K extends keyof O,
>(context: OptionValueBuildContext<K, O[K] | undefined>) : O[K] | undefined {
    let target : O[K] | undefined;

    const presetConfig : Record<
    string,
    MakeOptional<PresetOption<O[K]>, 'value' | 'enabled'>
    > = {};

    if (isOptionValueConfig(context.value)) {
        target = context.value.value;

        if (context.value.preset) {
            const keys = Object.keys(context.value.preset);
            for (let i = 0; i < keys.length; i++) {
                presetConfig[keys[i]] = context.value.preset[keys[i]];
            }
        }
    } else {
        target = context.value as O[K];
    }

    const globalComponentOption = getGlobalComponentOption(
        context.component,
        context.key as string,
    );

    if (
        globalComponentOption &&
        typeof globalComponentOption.value !== 'undefined'
    ) {
        target = globalComponentOption.value as O[K];
    }

    if (typeof target === 'undefined') {
        target = context.alt;
    }

    if (typeof target === 'undefined') {
        return undefined;
    }

    const globalPresets = { ...inject('preset') ?? {} } as Record<string, boolean>;
    const globalPresetKeys = Object.keys(globalPresets);
    for (let i = 0; i < globalPresetKeys.length; i++) {
        if (Object.prototype.hasOwnProperty.call(presetConfig, globalPresetKeys[i])) {
            presetConfig[globalPresetKeys[i]].enabled = globalPresets[globalPresetKeys[i]];
        } else {
            presetConfig[globalPresetKeys[i]] = {
                enabled: globalPresets[globalPresetKeys[i]],
            };
        }
    }

    if (
        globalComponentOption &&
        globalComponentOption.preset
    ) {
        if (globalComponentOption.preset) {
            mergePreset(presetConfig, globalComponentOption.preset);
        }
    }

    if (context.preset) {
        mergePreset(presetConfig, context.preset);
    }

    const keys = Object.keys(presetConfig);
    for (let i = 0; i < keys.length; i++) {
        const enabled = presetConfig[keys[i]].enabled ?? true;
        if (enabled) {
            target = mergeOption(
                context.key as string,
                target,
                presetConfig[keys[i]].value,
            );
        }
    }

    return target;
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

export function createOptionValueBuilder<O extends Record<string, any>>(
    component: string,
) {
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
