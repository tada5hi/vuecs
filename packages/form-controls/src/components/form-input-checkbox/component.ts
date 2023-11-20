/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType, SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { SlotName } from '../constants';
import { buildFormInputCheckbox } from './module';
import type { FormInputCheckboxLabelSlotProps } from './type';

export const VCFormInputCheckbox = defineComponent({
    slots: Object as SlotsType<{
        [SlotName.LABEL]: FormInputCheckboxLabelSlotProps
    }>,
    props: {
        modelValue: {
            type: [Object, Boolean, String, Number, Array] as PropType<unknown | unknown[]>,
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
    setup(props, { attrs, emit, slots }) {
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

            slotItems: slots,
            props: attrs,
        });
    },
});
