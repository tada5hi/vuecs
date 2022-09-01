/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    getConfigComponentOption,
    getConfigLibraryComponentOption, hasConfigComponentOption,
    hasConfigLibraryComponentOption,
    useConfig,
} from '../config';
import { Component } from './constants';
import { ComponentOptions, OptionLibrariesValueContext, OptionValueBuildContext } from './type';
import { mergeOption, mergeVNodeOption } from './merge';
import { hasOwnProperty } from '../utils';

export function extendOptionValueWithLibraries<
    C extends `${Component}` | Component,
    K extends keyof ComponentOptions<C>,
    >(
    component: C,
    key: K,
    value: ComponentOptions<C>[K],
    libraries: OptionLibrariesValueContext<ComponentOptions<C>[K]>,
) : ComponentOptions<C>[K] {
    const config = useConfig();

    const keys = [...new Set([
        ...Object.keys(config.library),
        ...Object.keys(libraries),
    ])];

    for (let i = 0; i < keys.length; i++) {
        const isEnabled : boolean = (hasOwnProperty(config.library, keys[i]) && Boolean(config.library[keys[i]].enabled)) ||
            (hasOwnProperty(libraries, keys[i]) && Boolean(libraries[keys[i]].enabled));

        if (!isEnabled) {
            continue;
        }

        if (
            hasOwnProperty(config.library, keys[i]) &&
            hasConfigLibraryComponentOption(keys[i], component, key)
        ) {
            value = mergeOption(key as string, value, getConfigLibraryComponentOption(keys[i], component, key)) as ComponentOptions<C>[K];
        } else if (
            hasOwnProperty(libraries, keys[i]) &&
            typeof libraries[keys[i]].value !== 'undefined'
        ) {
            value = mergeOption(key as string, value, libraries[keys[i]].value) as ComponentOptions<C>[K];
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
        // todo: if alt value override with library one if available :)
        target = extendOptionValueWithLibraries(context.component, context.key, target, context.library || {});
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
