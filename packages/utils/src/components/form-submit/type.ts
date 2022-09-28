/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef, OptionsInput, VNodeClass } from '@vue-layout/core';
import { ValidationResult } from '../type';

export type FormSubmitOptions = {
    type: string,
    class: VNodeClass,

    updateText: string,
    updateIconClass: VNodeClass,
    updateButtonClass: VNodeClass,

    createText: string
    createIconClass: VNodeClass,
    createButtonClass: VNodeClass,

    busy: MaybeRef<boolean>,
    valid: MaybeRef<boolean>,
    isEditing: boolean,
    submit: () => void | Promise<void>,
    validationResult: Partial<ValidationResult>
};

export type FormSubmitOptionsInput = OptionsInput<FormSubmitOptions,
'submit',
'busy' | 'valid'
>;
