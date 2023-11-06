/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue, PartialPick, VNodeClass, VNodeProperties,
} from '@vue-layout/core';
import type { Slots, VNodeChild } from 'vue';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';

export type FormGroupOptions = {
    slotItems: Slots,

    label: boolean,
    labelClass: VNodeClass,
    labelContent: VNodeChild,

    content?: VNodeChild,

    class: VNodeClass,
    props: VNodeProperties,

    hint: boolean,
    hintClass: VNodeClass,
    hintContent: VNodeChild,

    validation: boolean,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator,
    validationErrorClass: VNodeClass,
    validationWarningClass: VNodeClass,
};

export type FormGroupOptionsInput = OptionsInputValue<
PartialPick<FormGroupOptions,
'label' |
'labelClass' |
'labelContent' |
'hint' |
'hintClass' |
'hintContent' |
'class' |
'props' |
'validation' |
'validationErrorClass' |
'validationWarningClass'>
> &
PartialPick<FormGroupOptions, 'content' | 'slotItems' | 'validationMessages' | 'validationResult' | 'validationTranslator'>;
