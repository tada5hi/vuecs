/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue,
    OptionsOverride,
    PartialPick,
    VNodeClass,
} from '@vuecs/core';
import type { VNodeChild } from 'vue';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputBuildOptions = FormBaseOptions & {
    type: string,
    group: boolean,
    groupClass: VNodeClass,

    groupPrepend: boolean,
    groupPrependClass?: VNodeClass,
    groupPrependContent?: VNodeChild,

    groupAppend: boolean,
    groupAppendClass?: VNodeClass,
    groupAppendContent?: VNodeChild
};

export type FormInputBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsOverride<
    ExpectFormBaseOptions<FormInputBuildOptions>,
    OptionsInputValue<PartialPick<FormInputBuildOptions,
    'type' |
    'group' |
    'groupClass' |
    'groupPrepend' |
    'groupPrependClass' |
    'groupPrependContent' |
    'groupAppend' |
    'groupAppendClass' |
    'groupAppendContent'
    >>
    >;
