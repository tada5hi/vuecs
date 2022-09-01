/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeChild, h, mergeProps, unref,
} from 'vue';
import { FormGroup, FormGroupProperties } from '../form-group';
import { buildFormBaseOptions, handleFormValueChanged } from '../utils';
import { FormTextareaBuildOptions, FormTextareaBuildOptionsInput } from './type';
import { Component } from '../../options';

export function buildFormTextareaOptions(
    input: FormTextareaBuildOptionsInput,
) : FormTextareaBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormTextarea);

    return {
        ...options,
    };
}

export function buildFormTextarea(
    input: FormTextareaBuildOptionsInput,
) : VNode {
    const options = buildFormTextareaOptions(input);

    const children : VNodeChild = [];

    if (options.label) {
        children.push(h('label', [options.labelContent]));
    }

    const rawValue = unref(options.value);
    const rawValidationValue = unref(options.validationRulesResult.$model);

    return h(
        FormGroup,
        {
            validations: options.validationRulesResult,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        } as FormGroupProperties,
        {
            default: () => [
                ...children,
                h(
                    'textarea',
                    mergeProps(
                        {
                            placeholder: '...',
                            class: options.class,
                            onInput($event: any) {
                                if ($event.target.composing) {
                                    return;
                                }

                                handleFormValueChanged(options, $event.target.value);
                            },
                            ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
                            ...(typeof rawValidationValue !== 'undefined' ? { value: rawValidationValue } : {}),
                        },
                        options.props,
                    ),
                ),
            ],
        },
    );
}
