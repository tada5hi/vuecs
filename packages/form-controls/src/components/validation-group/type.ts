/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsOverride,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type ValidationGroupOptionsInput = OptionsOverride<
ValidationGroupOptions,
Partial<Pick<ValidationGroupOptions,
'slotItems' |
'validationResult' |
'validationMessages'
>>
>;
