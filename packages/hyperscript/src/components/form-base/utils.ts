/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createMerger } from 'smob';
import { unref } from 'vue';
import {
    Preset,
    createOptionValueBuilder,
    setMaybeRefValue,
    unrefWithDefault,
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

    const merger = createMerger({ array: false });
    const { buildOrFail } = createOptionValueBuilder<FormBaseOptions>(
        component,
    );

    return {
        ...options,

        class: buildOrFail({
            key: 'class',
            value: unref(options.class),
            ...merger(defaults.class || {}, {
                alt: '',
                preset: {
                    [Preset.BOOTSTRAP]: {
                        value: ['form-control'],
                    },
                    [Preset.BOOTSTRAP_V5]: {
                        value: ['form-control'],
                    },
                },
            }),
        }),
        props: buildOrFail({
            key: 'props',
            value: unref(options.props),
            alt: {},
            ...defaults.props,
        }),

        label: buildOrFail({
            key: 'label',
            value: unref(options.label),
            alt: true,
            ...defaults.label,
        }),
        labelClass: buildOrFail({
            key: 'labelClass',
            value: unref(options.labelClass),
            ...merger(defaults.labelClass || {}, {
                alt: '',
                preset: {
                    [Preset.BOOTSTRAP_V5]: {
                        value: ['form-label'],
                    },
                },
            }),
        }),
        labelContent: buildOrFail({
            key: 'labelContent',
            value: unref(options.labelContent),
            alt: 'Input',
            ...defaults.labelContent,
        }),

        validationMessages: unrefWithDefault(options.validationMessages, {}),
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
