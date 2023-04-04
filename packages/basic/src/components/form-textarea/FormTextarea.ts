/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    FormSelectOption,
    ValidationMessages,
    ValidationResult,
    ValidationTranslator,
} from '@vue-layout/hyperscript';
import { buildFormSelect, buildFormTextarea } from '@vue-layout/hyperscript';
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';

export const FormTextarea = defineComponent({
    name: 'FormTextarea',
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
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const label = toRef(props, 'label');
        const labelClass = toRef(props, 'labelClass');
        const labelContent = toRef(props, 'labelContent');

        const hint = toRef(props, 'hint');

        const value = toRef(props, 'modelValue');

        const validationResult = toRef(props, 'validationResult');
        const validationMessages = toRef(props, 'validationMessages');

        return () => buildFormTextarea({
            label,
            labelClass,
            labelContent,

            hint: hint.value,

            value: value.value,

            onChange(input) {
                emit('update:modelValue', input);
            },

            validationResult: validationResult.value,
            validationMessages: validationMessages.value,
            validationTranslator: props.validationTranslator,
        });
    },
});
