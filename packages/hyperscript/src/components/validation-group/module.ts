/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h, unref,
} from 'vue';
import { Preset, createOptionValueBuilder } from '@vue-layout/core';
import { Component } from '../constants';
import { ValidationResult } from '../type';
import { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';
import { isValidationRuleResultWithParams, isValidationRuleResultWithoutParams } from './utils';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    const { buildOrFail } = createOptionValueBuilder<ValidationGroupOptions>(
        Component.ValidationGroup,
    );

    return {
        ...options,

        class: buildOrFail({
            key: 'class',
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'form-group',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'form-group',
                },
            },
        }),

        props: buildOrFail({
            key: 'props',
            value: unref(options.props),
            alt: {},
        }),

        errorClass: buildOrFail({
            key: 'errorClass',
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'form-group-error',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'form-group-error',
                },
            },
        }),

        warningClass: buildOrFail({
            key: 'warningClass',
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'form-group-warning',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'form-group-warning',
                },
            },
        }),

        validationResult: options.validationResult || {} as ValidationResult<unknown>,
    };
}

export function buildValidationGroup(input: ValidationGroupOptionsInput) : VNode {
    const options = buildValidationGroupOptions(input);

    const translate = (validator: string, properties?: Record<string, any>) => {
        if (
            options.validationMessages &&
            Object.prototype.hasOwnProperty.call(options.validationMessages, validator)
        ) {
            return options.validationMessages[validator];
        }

        if (typeof options.validationTranslator !== 'undefined') {
            const translation : string | undefined = options.validationTranslator(validator, properties || {});
            if (
                typeof translation === 'string' &&
                translation !== validator
            ) {
                return translation;
            }
        }

        return `The ${validator} operator condition is not fulfilled.`;
    };

    const invalid : boolean = !!options.validationResult &&
        !!options.validationResult.$dirty &&
        !!options.validationResult.$invalid;

    const errors : string[] = [];
    const keys = Object.keys(options.validationResult);
    for (let i = 0; i < keys.length; i++) {
        if (options.validationResult[keys[i]].$invalid) {
            if (isValidationRuleResultWithParams(options.validationResult[keys[i]])) {
                errors.push(translate(keys[i], options.validationResult[keys[i]].$params));
            } else if (isValidationRuleResultWithoutParams(options.validationResult[keys[i]])) {
                errors.push(translate(keys[i]));
            }
        }
    }

    const renderChildren = () => {
        const children : VNodeArrayChildren = [];

        if (typeof options.content === 'function') {
            children.push(options.content({
                errors,
                invalid,
            }));
        } else {
            children.push(options.content);
        }

        children.push(errors.map((error) => h('div', {
            class: 'form-group-hint group-required',
        }, [error])));

        return children;
    };

    return h(
        'div',
        {
            class: [
                options.class,
                ...(options.validationResult.$invalid && options.validationResult.$dirty ? [options.errorClass] : []),
                ...(options.validationResult.$invalid && !options.validationResult.$dirty ? [options.warningClass] : []),
            ],
            ...options.props,
        },
        renderChildren(),
    );
}
