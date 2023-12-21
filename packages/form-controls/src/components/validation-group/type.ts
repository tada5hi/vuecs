import type {
    ComponentOptionsOverride,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationMessages, ValidationResult, ValidationTranslator } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type ValidationGroupOptionsInput = ComponentOptionsOverride<
ValidationGroupOptions,
Partial<Pick<ValidationGroupOptions,
'slotItems' |
'validationResult' |
'validationMessages'
>>
>;
