/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import { setMaybeRefValue } from './ref';
import { unrefWithDefault } from '../../utils';
import {
    ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput,
} from '../type';
import { Component, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';

export function buildFormBaseOptions<T extends FormBaseOptionsInput>(
    options: T,
    component: Component,
    defaults?: {
        [K in keyof FormBaseOptions]?: {
            alt?: FormBaseOptions[K],
            library?: {
                [key: string]: {
                    enabled?: boolean,
                    value?: FormBaseOptions[K]
                }
            },
        }
    },
): ExpectFormBaseOptions<T> & FormBaseOptions {
    defaults = defaults || {};

    return {
        ...options,

        class: buildOptionValueOrFail({
            component: component as Component.FormBase,
            key: 'class',
            value: unref(options.class),
            alt: 'form-control',
            library: {
                [Library.BOOTSTRAP]: {},
            },
            ...defaults.class,
        }),
        props: buildOptionValueOrFail({
            component: component as Component.FormBase,
            key: 'props',
            value: unref(options.props),
            alt: {},
            ...defaults.props,
        }),

        label: buildOptionValueOrFail({
            component: component as Component.FormBase,
            key: 'label',
            value: unref(options.label),
            alt: true,
            ...defaults.label,
        }),
        labelContent: buildOptionValueOrFail({
            component: component as Component.FormBase,
            key: 'labelContent',
            value: unref(options.labelContent),
            alt: 'Input',
            ...defaults.labelContent,
        }),

        validationMessages: unrefWithDefault(options.validationMessages, {}),
        validationRulesResult: unrefWithDefault(options.validationRulesResult, {}),
    };
}

export function handleFormValueChanged(options: FormBaseOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        setMaybeRefValue(options.value, value);
    }

    if (typeof options.validationRulesResult.$model !== 'undefined') {
        setMaybeRefValue(options.validationRulesResult.$model, value);
    }

    if (options.change) {
        options.change.call(null, value);
    }

    return options;
}
