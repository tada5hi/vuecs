/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import type {
    MaybeRef, OptionsInput, VNodeClass, VNodeProperties,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type {
    ListLoadFn,
} from '../type';

export type ListActionRefreshBuildOptions = ListBaseOptions & {
    text: boolean,
    textContent: VNodeChild | VNode | VNode[] | string,

    icon: boolean,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,
    iconContent: VNodeChild,

    busy: MaybeRef<boolean>,
    load: ListLoadFn,
};

export type ListActionRefreshBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListActionRefreshBuildOptions>,
never,
'load' | 'busy'
>;
