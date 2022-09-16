/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild } from 'vue';
import { MaybeRef, VNodeClass, VNodeProperties } from '../../type';
import {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListLoadFn, OptionsInput,
} from '../type';

export type ListActionRefreshBuildOptions = ListBaseOptions & {
    text: boolean,
    textContent: VNodeChild | VNode | VNode[],

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
