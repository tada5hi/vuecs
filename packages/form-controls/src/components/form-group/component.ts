/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';
import { buildFormGroup } from './module';

export const VCFormGroup = defineComponent({
    props: {
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
            type: Boolean,
            default: undefined,
        },
        hintClass: {
            type: [String, Array, Object],
            default: '',
        },
        hintContent: {
            type: String,
            default: '',
        },

        validation: {
            type: Boolean,
            default: true,
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
    setup(props, { attrs, slots }) {
        return () => buildFormGroup({
            label: props.label,
            labelClass: props.labelClass,
            labelContent: props.labelContent,

            hint: props.hint,

            validation: props.validation,
            validationResult: props.validationResult,
            validationMessages: props.validationMessages,
            validationTranslator: props.validationTranslator,

            slotItems: slots,

            props: attrs,
        });
    },
});
