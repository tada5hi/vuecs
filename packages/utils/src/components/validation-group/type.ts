/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { OptionsInput, VNodeClass, VNodeProperties } from '@vue-layout/core';
import { VNode, VNodeArrayChildren } from 'vue';
import { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';

export type ValidationGroupContentPayload = {
    errors: string[],
    invalid: boolean,
};

export type ValidationGroupOptions = {
    class: VNodeClass,
    props: VNodeProperties,
    content: VNodeArrayChildren | VNode | ((data: ValidationGroupContentPayload) => VNodeArrayChildren | VNode),

    errorClass: VNodeClass,
    warningClass: VNodeClass,

    validationResult: Partial<ValidationResult>,
    validationMessages?: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type ValidationGroupOptionsInput = OptionsInput<
ValidationGroupOptions,
'content',
'validationResult' | 'validationMessages' | 'validationTranslator'
>;
