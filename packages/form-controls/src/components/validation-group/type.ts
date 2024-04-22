import type {
    ComponentOptionsOverride, PartialPick, VNodeClass,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationMessages } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    dirty: boolean,
    validationMessages: ValidationMessages,
    itemClass: VNodeClass,
    itemTag: string,
};

export type ValidationGroupOptionsInput = ComponentOptionsOverride<
ValidationGroupOptions,
PartialPick<ValidationGroupOptions,
'slotItems' |
'dirty' |
'itemClass' |
'itemTag' |
'validationMessages'
>
>;
