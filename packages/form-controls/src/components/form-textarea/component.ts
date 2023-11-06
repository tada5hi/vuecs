/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineComponent } from 'vue';
import { buildFormTextarea } from './module';

export const FormTextarea = defineComponent({
    name: 'FormTextarea',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormTextarea({
            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            props: attrs,
        });
    },
});
