/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import {
    MaybeRef,
    OptionsInput,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import {
    ValidationMessages, ValidationResult, ValidationTranslator,
} from '../type';

export type FormBaseOptions = {
    label: boolean,
    labelClass: VNodeClass,
    labelContent: string | VNode | (VNode | string)[] | VNodeChild,

    class: VNodeClass,
    props: VNodeProperties,

    value?: MaybeRef<unknown>,

    onChange?: (input: any) => void,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};
export type FormBaseOptionsInput = OptionsInput<FormBaseOptions,
never,
'value' | 'onChange' | 'validationTranslator' | 'validationResult'>;

export type ExpectFormBaseOptions<T extends FormBaseOptions | FormBaseOptionsInput> =
    Omit<T, keyof FormBaseOptions | keyof FormBaseOptionsInput>;

export type FormBaseOptionsDefaults = {
    [K in keyof FormBaseOptions]?: FormBaseOptions[K]
};
