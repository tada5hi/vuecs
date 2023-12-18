/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionBuilder,
    setMaybeRefValue,
} from '@vuecs/core';
import { isReactive } from 'vue';
import type { Component } from '../constants';
import type {
    ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsDefaults, FormBaseOptionsInput,
} from './type';

export function buildFormBaseOptions<T extends FormBaseOptionsInput>(
    options: T,
    component: Component,
    defaults?: FormBaseOptionsDefaults,
): ExpectFormBaseOptions<T> & FormBaseOptions {
    defaults = defaults || {};

    const { buildOrFail } = createOptionBuilder<FormBaseOptions>(
        component,
    );

    return {
        ...options,

        slotItems: options.slotItems || {},

        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || '',
        }),
        props: buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),
    };
}

export function handleFormValueChanged(options: FormBaseOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        if (isReactive(options.value)) {
            options.value = value;
        } else {
            setMaybeRefValue(options.value, value);
        }
    }

    if (options.onChange) {
        options.onChange.call(null, value);
    }

    return options;
}
