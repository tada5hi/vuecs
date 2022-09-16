/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    PropType, VNodeArrayChildren, computed, defineComponent, h, render,
} from 'vue';
import { ValidationMessages, ValidationResultRules, ValidationTranslator } from '../type';
import { Component, buildOptionValue } from '../../options';
import { Library } from '../../constants';

export type FormGroupSlotScope = {
    errors: string[],
    invalid: boolean,
};

export type FormGroupProperties = {
    validations?: ValidationResultRules,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export const FormGroup = defineComponent({
    props: {
        validations: {
            default: () => {},
            type: Object as PropType<ValidationResultRules>,
        },
        validationMessages: {
            type: Object as PropType<ValidationMessages>,
            default: undefined,
        },
        validationTranslator: {
            type: Function as PropType<ValidationTranslator>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const translate = (validator: string, properties?: Record<string, any>) => {
            if (
                props.validationMessages &&
                Object.prototype.hasOwnProperty.call(props.validationMessages, validator)
            ) {
                return props.validationMessages[validator];
            }

            if (typeof props.validationTranslator !== 'undefined') {
                const translation : string | undefined = props.validationTranslator(validator, properties || {});
                if (typeof translation === 'string') {
                    return translation;
                }
            }

            return `The ${validator} operator condition is not fulfilled.`;
        };

        const invalid = computed(() => props.validations &&
            props.validations.$dirty &&
            props.validations.$invalid);

        const errors = computed(() => {
            if (!invalid.value || typeof props.validations === 'undefined') {
                return [];
            }

            return Object.keys(props.validations.$params).reduce(
                (errors: string[], validator) => {
                    if (props.validations && !props.validations[validator]) {
                        errors.push(translate(validator, props.validations.$params[validator]));
                    }

                    return errors;
                },
                [],
            );
        });

        const errorClazz = buildOptionValue({
            component: Component.FormGroup,
            key: 'errorClass',
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'form-group-error',
                },
            },
        });
        const warningClazz = buildOptionValue({
            component: Component.FormGroup,
            key: 'warningClass',
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'form-group-warning',
                },
            },
        });

        const renderChildren = () => {
            const children : VNodeArrayChildren = [];

            if (slots.default) {
                children.push(slots.default({
                    errors: errors.value,
                    invalid: invalid.value,
                } as FormGroupSlotScope));
            }

            children.push(errors.value.map((error) => h('div', {
                class: 'form-group-hint group-required',
            }, [error])));

            return children;
        };

        return () => h(
            'div',
            {
                class: [
                    buildOptionValue({
                        component: Component.FormGroup,
                        key: 'class',
                        alt: [],
                        library: {
                            [Library.BOOTSTRAP]: {
                                value: 'form-group',
                            },
                        },
                    }),
                    ...(props.validations.$error ? [errorClazz] : []),
                    ...(props.validations.$invalid && !props.validations.$dirty ? [warningClazz] : []),
                ],
                ...buildOptionValue({
                    component: Component.FormGroup, key: 'props', alt: {},
                }),
            },
            renderChildren(),
        );
    },
});
