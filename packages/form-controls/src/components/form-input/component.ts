import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { buildFormInput } from './module';
import type { SlotName } from '../constants';

export const VCFormInput = defineComponent({
    props: {
        modelValue: {
            type: String,
            default: '',
        },

        type: {
            type: String,
            default: 'text',
        },

        groupAppendClass: {
            type: String,
        },
        groupPrependClass: {
            type: String,
        },
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        [SlotName.GROUP_APPEND]: { class: string, tag: string },
        [SlotName.GROUP_PREPEND]: { class: string, tag: string }
    }>,
    setup(
        props,
        {
            attrs,
            emit,
            slots,
        },
    ) {
        return () => buildFormInput({
            type: props.type,

            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            slotItems: slots,

            groupAppendClass: props.groupAppendClass,
            groupPrependClass: props.groupPrependClass,

            props: attrs,
        });
    },
});
