/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Ilingo } from 'ilingo';
import Vue, { PropType } from 'vue';
import { LanguageFormGerman } from '../language/de/form';
import { LanguageFormEnglish } from '../language/en/form';

export type FormGroupComputed = {
    errors: string[],
    invalid: boolean
};

export type FormGroupProperties = {
    ilingo?: Ilingo,
    validations: Record<string, any>,
    locale?: string,
};

const language = new Ilingo({
    cache: {
        de: {
            form: LanguageFormGerman,
        },
        en: {
            form: LanguageFormEnglish,
        },
    },
});

export const FormGroup = Vue.extend<Record<string, any>, any, FormGroupComputed, FormGroupProperties>({
    props: {
        ilingo: {
            type: Object as PropType<Ilingo>,
            default: undefined,
        },
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

            const locale = this.ilingo ?
                this.ilingo.getLocale() :
                this.locale;

            return Object.keys(this.validations.$params).reduce(
                (errors: string[], validator) => {
                    if (!this.validations[validator]) {
                        // hope that lang file is already loaded ;)
                        let output = language
                            .getSync(
                                `form.${validator}`,
                                this.validations.$params[validator],
                                locale,
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
        if (this.ilingo) {
            language.setCache(this.ilingo.getCache());
        }
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
