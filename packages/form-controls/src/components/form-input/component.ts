import { defineComponent } from 'vue';
import { buildFormInput } from './module';

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
    setup(props, { attrs, emit }) {
        return () => buildFormInput({
            type: props.type,

            value: props.modelValue,

            onChange(input) {
                emit('update:modelValue', input);
            },

            props: attrs,
        });
    },
});
