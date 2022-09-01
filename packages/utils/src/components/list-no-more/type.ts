/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import { ExpectListBaseOptions, ListBaseOptions, OptionsInput } from '../type';

export type ListNoMoreBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    textContent: VNodeChild | VNode | VNode[],

    busy: boolean,
    total: number
};

export type ListNoMoreBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ExpectListBaseOptions<ListNoMoreBuildOptions<T>>
>;
