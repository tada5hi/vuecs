/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { buildFormSelect } from './module';
import type { FormSelectOption } from './type';

export const VCFormSelect = defineComponent({
    props: {
        modelValue: {
            type: String,
            default: '',
        },

        options: {
            type: Object as PropType<FormSelectOption[]>,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormSelect({
            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            props: attrs,
            options: props.options,
        });
    },
});
