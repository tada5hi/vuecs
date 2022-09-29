/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionValueBuilder,
    extractValueFromOptionValueInput,
    setMaybeRefValue, unrefWithDefault,
} from '@vue-layout/core';
import { Component } from '../constants';
import {
    ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsDefaults, FormBaseOptionsInput,
} from './type';

export function buildFormBaseOptions<T extends FormBaseOptionsInput>(
    options: T,
    component: Component,
    defaults?: FormBaseOptionsDefaults,
): ExpectFormBaseOptions<T> & FormBaseOptions {
    defaults = defaults || {};

    const builder = createOptionValueBuilder<FormBaseOptions>(
        component,
    );

    return {
        ...options,

        class: builder.buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || '',
        }),
        props: builder.buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),

        label: builder.buildOrFail({
            key: 'label',
            value: options.label,
            alt: defaults.label ?? true,
        }),
        labelClass: builder.buildOrFail({
            key: 'labelClass',
            value: options.labelClass,
            alt: defaults.labelClass || '',
        }),
        labelContent: builder.buildOrFail({
            key: 'labelContent',
            value: options.labelContent,
            alt: defaults.labelContent || 'Input',
        }),

        validationMessages: unrefWithDefault(extractValueFromOptionValueInput(options.validationMessages), {}),
        validationResult: options.validationResult || {},
    };
}

export function handleFormValueChanged(options: FormBaseOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        setMaybeRefValue(options.value, value);
    }

    if (options.onChange) {
        options.onChange.call(null, value);
    }

    return options;
}
