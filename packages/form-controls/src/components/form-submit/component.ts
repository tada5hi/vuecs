import type { ComponentOptionInputConfig } from '@vuecs/core';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { buildFormSubmit } from './module';
import type { ValidationMessages, ValidationResult } from '../type';

export const VCFormSubmit = defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: Boolean,
            default: true,
        },
        isEditing: {
            type: Boolean,
            default: false,
        },
        busy: {
            type: Boolean,
            default: false,
        },

        createText: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },
        createIconClass: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },
        createButtonClass: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },

        updateText: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },
        updateIconClass: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },
        updateButtonClass: {
            type: [String, Object] as PropType<string | ComponentOptionInputConfig<string>>,
            default: undefined,
        },

        submit: {
            type: Function as PropType<() => Promise<any> | any>,
        },

        valid: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormSubmit({
            icon: props.icon,
            busy: props.modelValue || props.busy,
            isEditing: props.isEditing,
            valid: props.valid,

            createText: props.createText,
            createIconClass: props.createIconClass,
            createButtonClass: props.createButtonClass,

            updateText: props.updateText,
            updateIconClass: props.updateIconClass,
            updateButtonClass: props.updateButtonClass,

            submit() {
                if (!props.submit) {
                    return;
                }

                emit('update:modelValue', true);

                Promise.resolve()
                    .then(props.submit)
                    .then(() => {
                        emit('update:modelValue', false);
                    });
            },

            props: attrs,
        });
    },
});
