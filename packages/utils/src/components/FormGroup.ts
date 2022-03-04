/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { PropType } from 'vue';
import { type Ilingo } from 'ilingo';

type FormGroupComputed = {
    errors: string[],
    invalid: boolean,
    translator?: Ilingo
};

export type FormGroupSlotScope = {
    errors: string[],
    invalid: boolean,
    ilingo?: Ilingo,
};

export type FormGroupProperties = {
    ilingo?: Ilingo,
    validations: Record<string, any>,
    locale?: string,
};

export const FormGroup = Vue.extend<any, any, FormGroupComputed, FormGroupProperties>({
    props: {
        validations: {
            required: true,
            type: Object,
        },
        locale: {
            required: false,
            type: String,
            default: undefined,
        },
        ilingo: {
            type: Object as PropType<Ilingo>,
            default: undefined,
        },
    },
    computed: {
        translator() : Ilingo | undefined {
            if (this.ilingo) {
                return this.ilingo;
            }

            if (this.$ilingo) {
                return this.$ilingo;
            }

            return undefined;
        },
        errors() {
            if (!this.invalid) {
                return [];
            }

            let { locale } = this;

            if (!locale && this.ilingo) {
                locale = this.ilingo.getLocale();
            }

            if (!locale && this.$ilingo) {
                locale = this.$ilingo.getLocale();
            }

            return Object.keys(this.validations.$params).reduce(
                (errors: string[], validator) => {
                    if (!this.validations[validator]) {
                        let output;
                        if (this.translator) {
                            output = this.translator
                                .getSync(
                                    `validation.${validator}`,
                                    this.validations.$params[validator],
                                    locale,
                                );

                            output = output !== validator ?
                                output :
                                this.translator
                                    .getSync(
                                        'app.validator.alt',
                                        { validator },
                                        locale,
                                    );
                        } else {
                            output = `The ${validator} operator condition is not fulfilled.`;
                        }

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
    render() {
        return this.$scopedSlots.default({
            errors: this.errors,
            invalid: this.invalid,
            ilingo: this.translator,
        } as FormGroupSlotScope);
    },
});
