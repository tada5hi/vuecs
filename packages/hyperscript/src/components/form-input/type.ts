/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import type {
    OptionsInput,
    VNodeClass,
} from '@vue-layout/core';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputBuildOptions = FormBaseOptions & {
    type: string,
    groupClass: VNodeClass,

    groupPrepend: boolean,
    groupPrependClass?: VNodeClass,
    groupPrependContent?: VNode | VNodeChild | string,

    groupAppend: boolean,
    groupAppendClass?: VNodeClass,
    groupAppendContent?: VNode | VNodeChild | string
};

export type FormInputBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsInput<ExpectFormBaseOptions<FormInputBuildOptions>>;
