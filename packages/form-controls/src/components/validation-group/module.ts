/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h } from 'vue';
import { createOptionBuilder, isObject } from '@vue-layout/core';
import { isValidationRuleResultWithParams, isValidationRuleResultWithoutParams, template } from './utils';
import { Component } from '../constants';
import type { ValidationResult } from '../type';
import type { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    const { buildOrFail } = createOptionBuilder<ValidationGroupOptions>(
        Component.ValidationGroup,
    );

    return {
        ...options,

        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: [],
        }),

        props: buildOrFail({
            key: 'props',
            value: options.props,
            alt: {},
        }),

        errorClass: buildOrFail({
            key: 'errorClass',
            value: options.errorClass,
            alt: [],
        }),

        warningClass: buildOrFail({
            key: 'warningClass',
            value: options.warningClass,
            alt: [],
        }),

        validationMessages: options.validationMessages || {},
        validationResult: options.validationResult || {} as ValidationResult<unknown>,
    };
}

export function buildValidationGroup(input: ValidationGroupOptionsInput) : VNodeChild {
    const options = buildValidationGroupOptions(input);

    const translate = (validator: string, properties?: Record<string, any>) => {
        if (
            options.validationMessages &&
            Object.prototype.hasOwnProperty.call(options.validationMessages, validator)
        ) {
            return template(options.validationMessages[validator], properties || {});
        }

        if (typeof options.validationTranslator !== 'undefined') {
            let translation = options.validationTranslator(validator, properties || {});
            if (typeof translation === 'string') {
                translation = template(translation, properties || {});
                if (translation !== validator) {
                    return translation;
                }
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
        if (
            isObject(options.validationResult[keys[i]]) &&
            options.validationResult[keys[i]].$invalid
        ) {
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

        if (options.hint) {
            children.push(h('div', {
                class: 'form-group-hint',
            }, [
                options.hint,
            ]));
        }

        return children;
    };

    return h(
        'div',
        {
            class: [
                options.class,
                ...(options.validationResult && options.validationResult.$invalid && options.validationResult.$dirty ? [options.errorClass] : []),
                ...(options.validationResult && options.validationResult.$invalid && !options.validationResult.$dirty ? [options.warningClass] : []),
            ],
            ...options.props,
        },
        renderChildren(),
    );
}
