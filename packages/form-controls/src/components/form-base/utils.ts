/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionBuilder,
    setMaybeRefValue,
} from '@vue-layout/core';
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

        hint: buildOrFail({
            key: 'hint',
            value: options.hint,
            alt: undefined,
        }),

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

        label: buildOrFail({
            key: 'label',
            value: options.label,
            alt: defaults.label ?? true,
        }),
        labelClass: buildOrFail({
            key: 'labelClass',
            value: options.labelClass,
            alt: defaults.labelClass || '',
        }),
        labelContent: buildOrFail({
            key: 'labelContent',
            value: options.labelContent,
            alt: defaults.labelContent || 'Input',
        }),

        validationMessages: options.validationMessages || {},
        validationResult: options.validationResult || {},
    };
}

export function handleFormValueChanged(options: FormBaseOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        options.value = setMaybeRefValue(options.value, value);
    }

    if (options.onChange) {
        options.onChange.call(null, value);
    }

    return options;
}
