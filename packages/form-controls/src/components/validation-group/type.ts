/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsOverride, VNodeClass, VNodeProperties,
} from '@vue-layout/core';
import type { VNodeChild } from 'vue';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';

export type ValidationGroupContentPayload = {
    errors: string[],
    invalid: boolean,
};

export type ValidationGroupOptions = {
    class: VNodeClass,
    props: VNodeProperties,
    content: VNodeChild | ((data: ValidationGroupContentPayload) => VNodeChild),

    hint?: VNodeChild,

    errorClass: VNodeClass,
    warningClass: VNodeClass,

    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type ValidationGroupOptionsInput = OptionsOverride<
ValidationGroupOptions,
Partial<Pick<ValidationGroupOptions,
'class' |
'props' |
'errorClass' |
'warningClass' |
'validationResult' |
'validationMessages'
>>
>;
