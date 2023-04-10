/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { Component } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import { buildValidationGroup } from '../validation-group';
import type { FormTextareaBuildOptions, FormTextareaBuildOptionsInput } from './type';

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
        children.push(h('label', { class: options.labelClass }, [options.labelContent]));
    }

    const rawValue = unref(options.value);

    return buildValidationGroup({
        content: [
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
                    },
                    options.props,
                ),
            ),
        ],
        hint: options.hint,
        validationResult: options.validationResult,
        validationMessages: options.validationMessages,
        validationTranslator: options.validationTranslator,
    });
}
