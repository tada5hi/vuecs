/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, h } from 'vue';
import { BaseValidation } from '@vuelidate/core';
import { FormGroup, FormGroupProperties } from '../../components';
import {
    FormGroupProps,
    FormInputBuildContext,
} from './type';

export function buildFormInput<T extends Record<string, any>>(
    context: FormInputBuildContext<T>,
) : VNode {
    const validations : Partial<BaseValidation> = context.validationGroup ?
        context.validationGroup[context.propName] : {};

    return h(FormGroup, {
        validations,
        validationMessages: context.validationMessages,
        validationTranslator: context.validationTranslator,
    } as FormGroupProperties, {
        default: (props: FormGroupProps) => h(
            'div',
            {
                class: {
                    'form-group': true,
                    'form-group-error': validations.$error,
                    'form-group-warning': validations.$invalid &&
                        !validations.$dirty,
                },
            },
            [
                h('label', Array.isArray(context.title) ? context.title : [context.title]),
                h('input', {
                    type: 'text',
                    placeholder: '...',
                    value: validations.$model,
                    ...(context.domProps || {}),
                    ...(context.attrs || {}),
                    class: 'form-control',
                    onInput($event: any) {
                        if ($event.target.composing) {
                            return;
                        }

                        validations.$model = $event.target.value;
                        this.$emit('update:modelValue', $event.target.value);

                        if (context.changeCallback) {
                            context.changeCallback.call(null, $event.target.value);
                        }
                    },
                }),
                props.errors.map((error) => h('div', {
                    class: 'form-group-hint group-required',
                }, [error])),
            ],
        ),
    });
}
