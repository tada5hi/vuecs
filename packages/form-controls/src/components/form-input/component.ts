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
    },
    emits: ['update:modelValue'],
    slots: Object as SlotsType<{
        [SlotName.GROUP_APPEND]: undefined,
        [SlotName.GROUP_PREPEND]: undefined
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

            props: attrs,
        });
    },
});
