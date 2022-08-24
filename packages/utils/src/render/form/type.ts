/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseValidation } from '@vuelidate/core';
import {
    ComputedRef, Ref, VNode, VNodeChild,
} from 'vue';
import { MaybeRef, ValidationMessages, ValidationTranslator } from '../type';

export type FormGroupProps = {
    errors: string[],
    invalid: boolean
};

// --------------------------------

export type FormBaseBuildContext<
    T extends Record<string, any> = Record<string, any>,
> = {
    title: string | VNode | (VNode | string)[] | VNodeChild,
    propName: keyof T | string,
    attrs?: Record<string, any>,
    domProps?: Record<string, any>,
    changeCallback?: (input: any) => void,
    validationGroup?: Record<keyof T, BaseValidation>,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormInputBuildContext<
    T extends Record<string, any> = Record<string, any>,
> = FormBaseBuildContext<T>;

export type FormSelectOption = {
    id: string | number,
    value: any
};

export type FormSelectBuildContext<
    T extends Record<string, any> = Record<string, any>,
> = FormBaseBuildContext<T> & {
    options: FormSelectOption[],
    optionDefaultText?: string,
};

export type FormSubmitContext = {
    updateText?: string,
    updateIconClass?: string,
    updateButtonClass?: string,

    createText?: string
    createIconClass?: string,
    createButtonClass?: string,

    busy: MaybeRef<boolean>,
    isEditing: MaybeRef<boolean>,
    submit: () => void | Promise<void>,

    validationGroup?: BaseValidation
};

export type FormTextareaBuildContext<
    T extends Record<string, any> = Record<string, any>,
> = FormBaseBuildContext<T>;
