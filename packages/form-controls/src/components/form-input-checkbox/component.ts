/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { buildFormInputCheckbox } from './module';

export const FormInputCheckbox = defineComponent({
    name: 'FormInputCheckbox',
    props: {
        modelValue: {
            type: [Object, Boolean, String, Number, Array] as PropType<unknown | unknown[]>,
            default: false,
        },

        group: {
            type: Boolean,
        },
        groupClass: {
            type: String,
        },

        label: {
            type: Boolean,
        },
        labelClass: {
            type: String,
        },
        labelContent: {
            type: String,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormInputCheckbox({
            group: props.group,
            groupClass: props.groupClass,

            label: props.label,
            labelClass: props.labelClass,
            labelContent: props.labelContent,

            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            props: attrs,
        });
    },
});
