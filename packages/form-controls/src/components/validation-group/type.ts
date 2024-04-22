import type {
    ComponentOptionsOverride, PartialPick, VNodeClass,
} from '@vuecs/core';
import type { Slots } from 'vue';
import type { ValidationSeverity } from '../constants';
import type { ValidationMessages } from '../type';

export type ValidationGroupOptions = {
    slotItems: Slots,
    severity?: `${ValidationSeverity}`,
    messages: ValidationMessages,
    itemClass: VNodeClass,
    itemTag: string,
};

export type ValidationGroupOptionsInput = ComponentOptionsOverride<
ValidationGroupOptions,
PartialPick<ValidationGroupOptions,
'slotItems' |
'severity' |
'itemClass' |
'itemTag' |
'messages'
>
>;
