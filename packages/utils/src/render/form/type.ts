/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChildren } from 'vue';
import { ValidationMessages, ValidationTranslator } from '../type';

export type ComponentFormMethods<T = Record<string, any>> = {
    [key: string]: any,
    submit: () => Promise<void>
};

export type ComponentFormComputed<T = Record<string, any>> = {
    isEditing: boolean
};

export type ComponentFormData<T = Record<string, any>> = {
    busy: boolean,
    form: Partial<T> | null
};

export type ComponentFormVuelidate<T = Record<string, any>> = {
    $v: {
        [key: string]: any,
        form: {
            [K in keyof T]: any
        }
    }
};

export type FormGroupProps = {
    errors: string[],
    invalid: boolean
};

// --------------------------------

export type FormInputBuildContext<T extends Record<string, any> = Record<string, any>> = {
    title: string | VNode | (VNode | string)[],
    propName: keyof T | string,
    attrs?: Record<string, any>,
    domProps?: Record<string, any>,
    changeCallback?: (input: string) => void,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormSelectOption = {
    id: string | number,
    value: any
};

export type FormSelectBuildContext<T extends Record<string, any> = Record<string, any>> = {
    title: VNodeChildren,
    propName: keyof T | string,
    attrs?: Record<string, any>,
    domProps?: Record<string, any>,
    changeCallback?: (input: any) => void,
    options: FormSelectOption[],
    optionDefaultText?: string,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormSubmitOptions = {
    updateText?: string,
    updateIcon?: string,
    createText?: string
    createIcon?: string
};

export type FormTextareaBuildContext<T extends Record<string, any> = Record<string, any>> = {
    title: string | VNode | (VNode | string)[],
    propName: keyof T | string,
    attrs?: Record<string, any>,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};
