import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vuecs/core';
import type { MaybeRef } from 'vue';

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
    invalid: boolean,
    isEditing: boolean,
    submit: () => void | Promise<void>,
};

export type FormSubmitOptionsInput = ComponentOptionsOverride<
FormSubmitOptions,
PartialPick<FormSubmitOptions,
'busy' |
'invalid' |
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
