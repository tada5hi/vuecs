/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import {
    ExpectFormBaseOptions,
    FormBaseOptions,
    FormBaseOptionsInput,
    OptionsInput,
} from '../type';
import { VNodeClass } from '../../type';

export type FormInputBuildOptions = FormBaseOptions & {
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
