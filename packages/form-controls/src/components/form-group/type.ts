import type {
    ComponentOptionsInputValue, PartialPick, VNodeClass, VNodeProperties,
} from '@vuecs/core';
import type { Slots, VNodeChild } from 'vue';
import type { ValidationSeverity } from '../constants';
import type { ValidationMessages } from '../type';

export type FormGroupOptions = {
    slotItems: Slots,

    label?: boolean,
    labelTag: string,
    labelClass: VNodeClass,
    labelContent?: VNodeChild,

    content?: VNodeChild,

    class: VNodeClass,
    props: VNodeProperties,

    hint?: boolean,
    hintTag: string,
    hintClass: VNodeClass,
    hintContent?: VNodeChild,

    validation: boolean,
    validationMessages: ValidationMessages,
    validationSeverity?: `${ValidationSeverity}`,
    validationErrorClass: VNodeClass,
    validationWarningClass: VNodeClass,
};

export type FormGroupOptionsInput = ComponentOptionsInputValue<
PartialPick<FormGroupOptions,
'label' |
'labelClass' |
'labelContent' |
'labelTag' |
'hint' |
'hintClass' |
'hintContent' |
'hintTag' |
'class' |
'props' |
'validation' |
'validationErrorClass' |
'validationWarningClass'>
> &
PartialPick<FormGroupOptions,
'content' |
'slotItems' |
'validationSeverity' |
'validationMessages'
>;
