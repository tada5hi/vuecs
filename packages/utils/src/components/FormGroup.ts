/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    PropType, defineComponent, h,
} from 'vue';
import { ValidationMessages, ValidationTranslator } from '../render';

export type FormGroupSlotScope = {
    errors: string[],
    invalid: boolean,
};

export type FormGroupProperties = {
    validations: Record<string, any>,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export const FormGroup = defineComponent({
    props: {
        validations: {
            default: undefined,
            type: Object,
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
    computed: {
        errors() {
            if (!this.invalid || typeof this.validations === 'undefined') {
                return [];
            }

            return Object.keys(this.validations.$params).reduce(
                (errors: string[], validator) => {
                    if (this.validations && !this.validations[validator]) {
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
                const translation : string | undefined = this.validationTranslator(validator, properties || {});
                if (typeof translation === 'string') {
                    return translation;
                }
            }

            return `The ${validator} operator condition is not fulfilled.`;
        },
    },
    render() {
        if (!this.$slots.default) {
            return h('');
        }

        return this.$slots.default({
            errors: this.errors,
            invalid: this.invalid,
        } as FormGroupSlotScope);
    },
});
