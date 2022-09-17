/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    PropType, VNodeArrayChildren, computed, defineComponent, h,
} from 'vue';
import { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';
import { Component, buildOptionValue } from '../../options';
import { Library } from '../../constants';
import { isValidationRuleResultWithParams, isValidationRuleResultWithoutParams } from './utils';

export type FormGroupSlotScope = {
    errors: string[],
    invalid: boolean,
};

export type FormGroupProperties = {
    validationResult?: ValidationResult,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export const FormGroup = defineComponent({
    props: {
        validationResult: {
            default: () => {},
            type: Object as PropType<ValidationResult>,
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

        const invalid = computed(() => props.validationResult &&
            props.validationResult.$dirty &&
            props.validationResult.$invalid);

        const errors = computed(() => {
            if (!invalid.value || typeof props.validationResult === 'undefined') {
                return [];
            }

            const messages : string[] = [];
            const keys = Object.keys(props.validationResult);
            for (let i = 0; i < keys.length; i++) {
                if (props.validationResult[keys[i]].$invalid) {
                    if (isValidationRuleResultWithParams(props.validationResult[keys[i]])) {
                        messages.push(translate(keys[i], props.validationResult[keys[i]].$params));
                    } else if (isValidationRuleResultWithoutParams(props.validationResult[keys[i]])) {
                        messages.push(translate(keys[i]));
                    }
                }
            }

            return messages;
        });

        const errorClazz = buildOptionValue({
            component: Component.FormGroup,
            key: 'errorClass',
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'form-group-error',
                },
                [Library.BOOTSTRAP_V5]: {
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
                [Library.BOOTSTRAP_V5]: {
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
                            [Library.BOOTSTRAP_V5]: {
                                value: 'form-group',
                            },
                        },
                    }),
                    ...(props.validationResult.$error ? [errorClazz] : []),
                    ...(props.validationResult.$invalid && !props.validationResult.$dirty ? [warningClazz] : []),
                ],
                ...buildOptionValue({
                    component: Component.FormGroup, key: 'props', alt: {},
                }),
            },
            renderChildren(),
        );
    },
});
