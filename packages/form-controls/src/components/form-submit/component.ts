/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionInputConfig } from '@vue-layout/core';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { buildFormSubmit } from './module';
import type { ValidationResult } from '../type';

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
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },
        createIconClass: {
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },
        createButtonClass: {
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },

        updateText: {
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },
        updateIconClass: {
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },
        updateButtonClass: {
            type: [String, Object] as PropType<string | OptionInputConfig<string>>,
            default: undefined,
        },

        submit: {
            type: Function as PropType<() => Promise<any> | any>,
        },

        validationResult: {
            type: Object as PropType<Partial<ValidationResult>>,
            default: undefined,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
        return () => buildFormSubmit({
            icon: props.icon,
            busy: props.modelValue || props.busy,
            isEditing: props.isEditing,

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
            validationResult: props.validationResult,

            props: attrs,
        });
    },
});
