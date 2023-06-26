/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type {
    ValidationMessages,
    ValidationResult,
    ValidationTranslator,
} from '../type';
import { buildFormSelect } from './module';
import type { FormSelectOption } from './type';

export const FormSelect = defineComponent({
    name: 'FormSelect',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        label: {
            type: Boolean,
            default: false,
        },
        labelClass: {
            type: String,
            default: '',
        },
        labelContent: {
            type: String,
            default: '',
        },

        hint: {
            type: String,
            default: undefined,
        },

        validationResult: {
            type: Object as PropType<Partial<ValidationResult>>,
            default: undefined,
        },
        validationMessages: {
            type: Object as PropType<ValidationMessages>,
            default: undefined,
        },
        validationTranslator: {
            type: Function as PropType<ValidationTranslator>,
            default: undefined,
        },

        options: {
            type: Object as PropType<FormSelectOption[]>,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormSelect({
            label: props.label,
            labelClass: props.labelClass,
            labelContent: props.labelContent,

            hint: props.hint,

            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            validationResult: props.validationResult,
            validationMessages: props.validationMessages,
            validationTranslator: props.validationTranslator,

            props: attrs,
            options: props.options,
        });
    },
});
