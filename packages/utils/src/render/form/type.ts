/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseValidation } from '@vuelidate/core';
import {
    VNode, VNodeChild,
} from 'vue';
import { OptionsInput, ValidationMessages, ValidationTranslator } from '../type';
import { MaybeRef, VNodeProperties } from '../../type';

export type FormGroupProps = {
    errors: string[],
    invalid: boolean
};

// --------------------------------------

export type FormBaseBuildOptions = {
    label: boolean,
    labelContent: string | VNode | (VNode | string)[] | VNodeChild,

    props: VNodeProperties,

    value?: MaybeRef<unknown>,

    change?: (input: any) => void,
    validationRulesResult: Partial<BaseValidation>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormBaseBuildOptionsInput = OptionsInput<
FormBaseBuildOptions,
never,
'value' | 'change' | 'validationTranslator'
>;

export type ExpectFormBaseBuildOptions<T extends FormBaseBuildOptions | FormBaseBuildOptionsInput> =
    Omit<T, keyof FormBaseBuildOptions | keyof FormBaseBuildOptionsInput>;

// --------------------------------------

export type FormInputBuildOptions = FormBaseBuildOptions & {
    prepend: boolean,
    prependTextContent: VNode | VNodeChild | string,

    append: boolean,
    appendTextContent: VNode | VNodeChild | string
};

export type FormInputBuildOptionsInput = FormBaseBuildOptionsInput & OptionsInput<
ExpectFormBaseBuildOptions<FormInputBuildOptions>,
never,
'appendTextContent' | 'prependTextContent'
>;

// --------------------------------------

export type FormSelectOption = {
    id: string | number,
    value: any
};

export type FormSelectBuildOptions = FormBaseBuildOptions & {
    options: FormSelectOption[],
    optionDefaultText: string,
};

export type FormSelectBuildOptionsInput = FormBaseBuildOptionsInput & OptionsInput<
ExpectFormBaseBuildOptions<FormSelectBuildOptions>,
never,
never,
'options'
>;

// --------------------------------------

export type FormSubmitOptions = {
    updateText: string,
    updateIconClass: string,
    updateButtonClass: string,

    createText: string
    createIconClass: string,
    createButtonClass: string,

    busy: MaybeRef<boolean>,
    isEditing: boolean,
    submit: () => void | Promise<void>,

    validationRulesResult: Partial<BaseValidation>
};

export type FormSubmitOptionsInput = OptionsInput<
FormSubmitOptions,
'submit',
'busy'
>;

// --------------------------------------

export type FormTextareaBuildOptions = FormBaseBuildOptions;
export type FormTextareaBuildOptionsInput = FormBaseBuildOptionsInput &
OptionsInput<ExpectFormBaseBuildOptions<FormInputBuildOptions>>;
