/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import type {
    MaybeRef,
    OptionsInput,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListNoMoreBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    textContent: VNodeChild | VNode | VNode[],

    busy: boolean,
    total?: MaybeRef<number>
};

export type ListNoMoreBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListNoMoreBuildOptions<T>>,
never,
'total'
>;
