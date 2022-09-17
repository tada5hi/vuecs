/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    getConfigComponentOption,
    getConfigPresetComponentOption, hasConfigComponentOption,
    useConfig,
} from '../config';
import { Component } from './constants';
import { ComponentOptions, OptionPresetsValueContext, OptionValueBuildContext } from './type';
import { mergeOption, mergeVNodeOption } from './merge';
import { hasOwnProperty } from '../utils';

export function extendOptionValueWithPresets<
    C extends `${Component}` | Component,
    K extends keyof ComponentOptions<C>,
    >(
    component: C,
    key: K,
    value: ComponentOptions<C>[K],
    presets: OptionPresetsValueContext<ComponentOptions<C>[K]>,
) : ComponentOptions<C>[K] {
    const config = useConfig();

    const keys = [...new Set([
        ...Object.keys(config.preset),
        ...Object.keys(presets),
    ])];

    for (let i = 0; i < keys.length; i++) {
        const isEnabled : boolean = (hasOwnProperty(config.preset, keys[i]) && Boolean(config.preset[keys[i]].enabled)) ||
            (hasOwnProperty(presets, keys[i]) && Boolean(presets[keys[i]].enabled));

        if (!isEnabled) {
            continue;
        }

        if (
            hasOwnProperty(config.preset, keys[i])
        ) {
            const presetValue = getConfigPresetComponentOption(keys[i], component, key);
            if (typeof presetValue !== 'undefined') {
                value = mergeOption(key as string, value, presetValue) as ComponentOptions<C>[K];
                continue;
            }
        }

        if (
            hasOwnProperty(presets, keys[i]) &&
            typeof presets[keys[i]].value !== 'undefined'
        ) {
            value = mergeOption(key as string, value, presets[keys[i]].value) as ComponentOptions<C>[K];
        }
    }

    return value;
}

export function buildOptionValue<
    C extends `${Component}` | Component,
    K extends keyof ComponentOptions<C>,
    >(context: OptionValueBuildContext<C, K>) : ComponentOptions<C>[K] | undefined {
    let target : ComponentOptions<C>[K] | undefined = context.value;

    if (
        hasConfigComponentOption(context.component, context.key)
    ) {
        if (
            typeof target !== 'undefined'
        ) {
            target = mergeVNodeOption(context.key as string, target, getConfigComponentOption(context.component, context.key)) as any;
        } else {
            target = getConfigComponentOption(context.component, context.key);
        }
    }

    if (typeof target === 'undefined') {
        target = context.alt;
    }

    if (typeof target !== 'undefined') {
        // todo: if alt value override with preset one if available :)
        target = extendOptionValueWithPresets(context.component, context.key, target, context.preset || {});
    }

    return target;
}

export function buildOptionValueOrFail<
    C extends `${Component}` | Component,
    K extends keyof ComponentOptions<C>,
    >(context: OptionValueBuildContext<C, K>) : NonNullable<ComponentOptions<C>[K]> {
    const target = buildOptionValue(context);

    if (typeof target === 'undefined') {
        throw new Error(`A value for option ${context.key as string} of component ${context.component} is required.`);
    }

    return target as NonNullable<ComponentOptions<C>[K]>;
}
