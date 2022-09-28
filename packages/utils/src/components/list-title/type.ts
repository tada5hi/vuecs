/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import {
    OptionsInput,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListTitleBuildOptions = ListBaseOptions & {
    text: boolean,
    textType: string,
    textClass: VNodeClass,
    textProps: VNodeProperties,
    textContent: VNodeChild | VNode | VNode[],

    icon: boolean,
    iconClass: VNodeClass,
    iconProps: VNodeProperties
};

export type ListTitleBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListTitleBuildOptions>>;
