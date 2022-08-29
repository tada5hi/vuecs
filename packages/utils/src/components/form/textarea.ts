/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeChild, h, unref,
} from 'vue';
import { FormGroup, FormGroupProperties } from '../static';
import { setMaybeRefValue } from '../utils';
import {
    FormGroupProps,
    FormTextareaBuildOptions,
    FormTextareaBuildOptionsInput,
} from './type';
import { buildFormBaseOptions, handleFormValueChanged } from './utils';

export function buildFormTextareaOptions(
    input: FormTextareaBuildOptionsInput,
) : FormTextareaBuildOptions {
    const options = buildFormBaseOptions(input);

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
            default: (props: FormGroupProps) => h(
                'div',
                {
                    class: {
                        'form-group': true,
                        'form-group-error': options.validationRulesResult.$error,
                        'form-group-warning': options.validationRulesResult.$invalid &&
                            !options.validationRulesResult.$dirty,
                    },
                },
                [
                    ...children,
                    h('textarea', {
                        placeholder: '...',
                        class: 'form-control',
                        onInput($event: any) {
                            if ($event.target.composing) {
                                return;
                            }

                            handleFormValueChanged(options, $event.target.value);
                        },
                        ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
                        ...(typeof rawValidationValue !== 'undefined' ? { value: rawValidationValue } : {}),
                        ...options.props,
                    }),
                    props.errors.map((error) => h('div', {
                        staticClass: 'form-group-hint group-required',
                    }, [error])),
                ],
            ),
        },
    );
}
