/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, h,
} from 'vue';
import { BaseValidation } from '@vuelidate/core';
import { FormGroup, FormGroupProperties } from '../../components';
import {
    FormGroupProps,
    FormSelectBuildContext,
    FormSelectOption,
} from './type';

export function buildFormSelect<T extends Record<string, any>>(
    context: FormSelectBuildContext<T>,
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
                    staticClass: 'form-group',
                    class: {
                        'form-group-error': validations.$error,
                        'form-group-warning': validations.$invalid &&
                            !validations.$dirty,
                    },
                },
                [
                    h('label', Array.isArray(context.title) ? context.title : [context.title]),
                    h('select', {
                        value: validations.$model,
                        ...(context.attrs || {}),
                        ...(context.domProps || {}),
                        directives: [{
                            name: 'model',
                            value: validations.$model,
                        }],
                        class: 'form-control',
                        onChange($event: any) {
                            const $$selectedVal = Array.prototype.filter.call($event.target.options, (o) => o.selected).map((o) => ('_value' in o ? o._value : o.value));
                            const value = $event.target.multiple ? $$selectedVal : $$selectedVal[0];

                            validations.$model = value;
                            this.$emit('update:modelValue', value);

                            if (context.changeCallback) {
                                context.changeCallback.call(null, value);
                            }
                        },
                    }, [
                        h('option', {
                            value: '',
                        }, ['-- ', (context.optionDefaultText ? context.optionDefaultText : 'Select option'), ' --']),
                        context.options.map((item: FormSelectOption) => h('option', {
                            key: item.id,
                            domProps: {
                                value: item.id,
                            },
                        }, item.value)),
                    ]),
                    props.errors.map((error) => h('div', {
                        class: 'form-group-hint group-required',
                    }, [error])),
                ],
            ),
        },
    });
}
