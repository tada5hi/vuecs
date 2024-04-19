import type {
    ComponentOptionsOverride,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationMessages } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    validationMessages: ValidationMessages
};

export type ValidationGroupOptionsInput = ComponentOptionsOverride<
ValidationGroupOptions,
Partial<Pick<ValidationGroupOptions,
'slotItems' |
'validationMessages'
>>
>;
