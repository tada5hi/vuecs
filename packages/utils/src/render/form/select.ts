/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Component, CreateElement, VNode, VNodeChildren,
} from 'vue';
import {
    ComponentFormComputed, ComponentFormData,
    ComponentFormMethods, ComponentFormVuelidate,
    FormGroupProps,
} from './type';

type SelectOption = {
    id: string | number,
    value: any
};

export type FormSelectBuildContext<T extends Record<string, any> = Record<string, any>> = {
    title: VNodeChildren,
    propName: keyof T | string,
    attrs?: Record<string, any>,
    domProps?: Record<string, any>,
    formGroup: Component,
    changeCallback?: (input: any) => void,
    options: SelectOption[],
    optionDefaultText?: string
};

export function buildFormSelect<T extends Record<string, any>>(
    instance: ComponentFormMethods<T> &
    ComponentFormComputed<T> &
    ComponentFormData<T> &
    ComponentFormVuelidate<T>,
    h: CreateElement,
    context: FormSelectBuildContext<T>,
) : VNode {
    return h(context.formGroup, {
        props: {
            validations: instance.$v.form[context.propName],
        },
        scopedSlots: {
            default: (props: FormGroupProps) => h(
                'div',
                {
                    staticClass: 'form-group',
                    class: {
                        'form-group-error': instance.$v.form[context.propName].$error,
                        'form-group-warning': instance.$v.form[context.propName].$invalid &&
                            !instance.$v.form[context.propName].$dirty,
                    },
                },
                [
                    h('label', context.title),
                    h('select', {
                        attrs: {
                            ...(context.attrs || {}),
                        },
                        domProps: {
                            value: instance.$v.form[context.propName].$model,
                            ...(context.domProps || {}),
                        },
                        directives: [{
                            name: 'model',
                            value: instance.$v.form[context.propName].$model,
                        }],
                        staticClass: 'form-control',
                        on: {
                            change($event: any) {
                                const $$selectedVal = Array.prototype.filter.call($event.target.options, (o) => o.selected).map((o) => ('_value' in o ? o._value : o.value));

                                instance.$set(
                                    instance.$v.form[context.propName],
                                    '$model',
                                    $event.target.multiple ? $$selectedVal : $$selectedVal[0],
                                );

                                if (context.changeCallback) {
                                    context.changeCallback.call(null, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
                                }
                            },
                        },
                    }, [
                        h('option', {
                            domProps: {
                                value: '',
                            },
                        }, ['-- ', (context.optionDefaultText ? context.optionDefaultText : 'Select option'), ' --']),
                        context.options.map((item: SelectOption) => h('option', {
                            key: item.id,
                            domProps: {
                                value: item.id,
                            },
                        }, item.value)),
                    ]),
                    props.errors.map((error) => h('div', {
                        staticClass: 'form-group-hint group-required',
                    }, [error])),
                ],
            ),
        },
    });
}
