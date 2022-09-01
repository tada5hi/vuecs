/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import { VNodeClass, VNodeProperties } from '../../type';
import { ExpectListBaseOptions, ListBaseOptions, OptionsInput } from '../type';

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

export type ListTitleBuildOptionsInput = OptionsInput<
ExpectListBaseOptions<ListTitleBuildOptions>>;
