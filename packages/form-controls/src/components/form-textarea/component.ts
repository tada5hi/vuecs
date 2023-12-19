import { defineComponent } from 'vue';
import { buildFormTextarea } from './module';

export const VCFormTextarea = defineComponent({
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
