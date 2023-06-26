/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    MaybeRef,
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import type { VNodeChild } from 'vue';
import type {
    ValidationMessages, ValidationResult, ValidationTranslator,
} from '../type';

export type FormBaseOptions = {
    label: boolean,
    labelClass: VNodeClass,
    labelContent: VNodeChild,

    hint?: VNodeChild,

    class: VNodeClass,
    props: VNodeProperties,

    value?: MaybeRef<unknown>,

    onChange?: (input: any) => void,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormBaseOptionsInput = OptionsOverride<
FormBaseOptions,
OptionsInputValue<PartialPick<FormBaseOptions, 'label' | 'labelClass' | 'labelContent' | 'hint' | 'class' | 'props'>> &
PartialPick<FormBaseOptions, 'validationMessages' | 'validationResult'>
>;

export type ExpectFormBaseOptions<T> = Omit<T, keyof FormBaseOptions>;

export type FormBaseOptionsDefaults = {
    [K in keyof FormBaseOptions]?: FormBaseOptions[K]
};
