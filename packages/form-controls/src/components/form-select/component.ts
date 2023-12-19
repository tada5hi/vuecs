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

        optionDefault: {
            type: Boolean,
            default: true,
        },
        optionDefaultId: {
            type: [String, Number],
        },
        optionDefaultValue: {
            type: String,
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

            optionDefault: props.optionDefault,
            optionDefaultId: props.optionDefaultId,
            optionDefaultValue: props.optionDefaultValue,
        });
    },
});
