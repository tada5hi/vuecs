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
    FormTextareaBuildContext,
} from './type';

export function buildFormTextarea<T extends Record<string, any>>(
    context: FormTextareaBuildContext<T>,
) : VNode {
    const validations : Partial<BaseValidation> = context.validationGroup ?
        context.validationGroup[context.propName] : {};

    return h(FormGroup, {
        props: {
            validations,
            validationMessages: context.validationMessages,
            validationTranslator: context.validationTranslator,
        } as FormGroupProperties,
        scopedSlots: {
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
                    h('textarea', {
                        placeholder: '...',
                        ...(context.attrs || {}),

                        value: validations.$model,
                        ...(context.domProps || {}),

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
                        staticClass: 'form-group-hint group-required',
                    }, [error])),
                ],
            ),
        },
    });
}
