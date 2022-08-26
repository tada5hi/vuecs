/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, h, unref,
} from 'vue';
import { FormGroup, FormGroupProperties } from '../../components';
import {
    FormGroupProps,
    FormSelectBuildOptions,
    FormSelectBuildOptionsInput,
    FormSelectOption,
} from './type';
import { buildFormBaseOptions } from './utils';
import { unrefWithDefault } from '../../utils';

export function buildFormInputOptions(
    input: FormSelectBuildOptionsInput,
) : FormSelectBuildOptions {
    const options = buildFormBaseOptions(input);

    return {
        ...options,

        options: unref(options.options),
        optionDefaultText: unrefWithDefault(options.optionDefaultText, 'Select'),
    };
}

export function buildFormSelect(
    input: FormSelectBuildOptions,
) : VNode {
    const options = buildFormInputOptions(input);

    return h(
        FormGroup,
        {
            validations: options.validationRules,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        } as FormGroupProperties,
        {
            default: (props: FormGroupProps) => h(
                'div',
                {
                    staticClass: 'form-group',
                    class: {
                        'form-group-error': options.validationRules.$error,
                        'form-group-warning': options.validationRules.$invalid &&
                            !options.validationRules.$dirty,
                    },
                },
                [
                    h('label', Array.isArray(options.labelContent) ? options.labelContent : [options.labelContent]),
                    h('select', {
                        value: options.validationRules.$model,
                        directives: [{
                            name: 'model',
                            value: options.validationRules.$model,
                        }],
                        class: 'form-control',
                        onChange($event: any) {
                            const $$selectedVal = Array.prototype.filter.call($event.target.options, (o) => o.selected).map((o) => ('_value' in o ? o._value : o.value));
                            const value = $event.target.multiple ? $$selectedVal : $$selectedVal[0];

                            options.validationRules.$model = value;
                            this.$emit('update:modelValue', value);

                            if (options.changeCallback) {
                                options.changeCallback.call(null, value);
                            }
                        },
                        ...options.props,
                    }, [
                        h('option', {
                            value: '',
                        }, ['-- ', options.optionDefaultText, ' --']),
                        options.options.map((item: FormSelectOption) => h('option', {
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
    );
}
