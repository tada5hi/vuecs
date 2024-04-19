import type {
    ComponentOptionsOverride,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationMessages } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    dirty: boolean,
    validationMessages: ValidationMessages
};

export type ValidationGroupOptionsInput = ComponentOptionsOverride<
ValidationGroupOptions,
Partial<Pick<ValidationGroupOptions,
'slotItems' |
'dirty' |
'validationMessages'
>>
>;
