/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue from 'vue';
import { useLayoutLanguage } from '../utils';

export type FormGroupComputed = {
    errors: string[],
    invalid: boolean
};

export type FormGroupProperties = {
    validations: Record<string, any>,
    locale?: string,
};

export const FormGroup = Vue.extend<Record<string, any>, any, FormGroupComputed, FormGroupProperties>({
    props: {
        validations: {
            required: true,
            type: Object,
        },
        locale: {
            required: false,
            type: String,
            default: 'en',
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
                        // hope that lang file is already loaded ;)
                        let output = useLayoutLanguage()
                            .getSync(
                                `form.${validator}`,
                                this.validations.$params[validator],
                                this.locale,
                            );

                        output = output !== validator ?
                            output :
                            `The ${validator} operator condition is not fulfilled.`;

                        errors.push(output);
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
    created() {
        Promise.resolve()
            .then(() => useLayoutLanguage().loadFile('form', this.locale));
    },
    beforeCreate() {

    },
    render() {
        return this.$scopedSlots.default({
            errors: this.errors,
            invalid: this.invalid,
        });
    },
});
