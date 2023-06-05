/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ComponentOptionConfig } from '@vue-layout/core';
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import { buildFormSubmit } from './module';
import type { ValidationResult } from '../type';

export const FormSubmit = defineComponent({
    name: 'FormSubmit',
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

        createText: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
            default: undefined,
        },
        createIconClass: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
            default: undefined,
        },
        createButtonClass: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
            default: undefined,
        },

        updateText: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
            default: undefined,
        },
        updateIconClass: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
            default: undefined,
        },
        updateButtonClass: {
            type: [String, Object] as PropType<string | ComponentOptionConfig<string>>,
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
        const busy = toRef(props, 'modelValue');
        const icon = toRef(props, 'icon');
        const isEditing = toRef(props, 'isEditing');

        const createText = toRef(props, 'createText');
        const createIconClass = toRef(props, 'createIconClass');
        const createButtonClass = toRef(props, 'createButtonClass');

        const updateText = toRef(props, 'updateText');
        const updateIconClass = toRef(props, 'updateIconClass');
        const updateButtonClass = toRef(props, 'updateButtonClass');

        const validationResult = toRef(props, 'validationResult');

        return () => buildFormSubmit({
            icon,
            busy,
            isEditing,

            createText: createText.value,
            createIconClass: createIconClass.value,
            createButtonClass: createButtonClass.value,

            updateText: updateText.value,
            updateIconClass: updateIconClass.value,
            updateButtonClass: updateButtonClass.value,

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
            validationResult: validationResult.value,

            props: attrs,
        });
    },
});
