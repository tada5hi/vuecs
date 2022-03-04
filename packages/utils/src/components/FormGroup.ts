/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { PropType } from 'vue';
import { ValidationMessages, ValidationTranslator } from '../render';

type FormGroupComputed = {
    errors: string[],
    invalid: boolean
};

export type FormGroupSlotScope = {
    errors: string[],
    invalid: boolean,
};

export type FormGroupProperties = {
    validations: Record<string, any>,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export const FormGroup = Vue.extend<any, any, FormGroupComputed, FormGroupProperties>({
    props: {
        validations: {
            required: true,
            type: Object,
        },
        validationMessages: {
            type: Object as PropType<Record<string, string>>,
            default: undefined,
        },
        validationTranslator: {
            type: Function,
            default: undefined,
        },
    },
    computed: {
        errors() {
            if (!this.invalid) {
                return [];
            }

            return Object.keys(this.validations.$params).reduce(
                (errors: string[], validator) => {
                    if (!this.validations[validator]) {
                        errors.push(this.translate(validator, this.validations.$params[validator]));
                    }

                    return errors;
                },
                [],
            );
        },
        invalid() {
            return this.validations &&
                    this.validations.$dirty &&
                    this.validations.$invalid;
        },
    },
    methods: {
        translate(validator: string, properties?: Record<string, any>) {
            if (
                this.validationMessages &&
                Object.prototype.hasOwnProperty.call(this.validationMessages, validator)
            ) {
                return this.validationMessages[validator];
            }

            if (typeof this.validationTranslator !== 'undefined') {
                const translation = this.validationTranslator(validator, properties);
                if (typeof translation === 'string') {
                    return translation;
                }
            }

            return `The ${validator} operator condition is not fulfilled.`;
        },
    },
    render() {
        return this.$scopedSlots.default({
            errors: this.errors,
            invalid: this.invalid,
        } as FormGroupSlotScope);
    },
});
