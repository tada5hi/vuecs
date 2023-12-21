import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vuecs/core';
import type { MaybeRef } from 'vue';
import type { ValidationResult } from '../type';

export type FormSubmitOptions = {
    type: string,

    props: VNodeProperties,
    class: VNodeClass,

    icon: boolean,

    updateText: string,
    updateIconClass: VNodeClass,
    updateButtonClass: VNodeClass,

    createText: string,
    createIconClass: VNodeClass,
    createButtonClass: VNodeClass,

    busy: MaybeRef<boolean>,
    valid: boolean,
    isEditing: boolean,
    submit: () => void | Promise<void>,
    validationResult: Partial<ValidationResult>
};

export type FormSubmitOptionsInput = ComponentOptionsOverride<
FormSubmitOptions,
PartialPick<FormSubmitOptions,
'busy' |
'valid' |
'validationResult' |
'isEditing'
> &
ComponentOptionsInputValue<PartialPick<FormSubmitOptions,
'type' |
'props' |
'class' |
'icon' |
'updateText' |
'updateButtonClass' |
'updateIconClass' |
'createText' |
'createButtonClass' |
'createIconClass'
>>
>;
