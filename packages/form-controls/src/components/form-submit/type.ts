/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
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

export type FormSubmitOptionsInput = OptionsOverride<
FormSubmitOptions,
PartialPick<FormSubmitOptions,
'busy' |
'valid' |
'validationResult' |
'isEditing'
> &
OptionsInputValue<PartialPick<FormSubmitOptions,
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
