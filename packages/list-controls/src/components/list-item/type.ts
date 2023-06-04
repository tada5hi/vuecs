/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from '@vue/runtime-core';
import type { VNode } from 'vue';
import type {
    OptionsInput,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListItemSlotProps<T> = {
    data: T,
    busy: boolean,
    index?: number,
    deleted: () => void,
    updated: (item: T) => void,
    [key: string]: any
};

export type ListItemBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    data: T,
    fn?: (item: T, props: ListItemSlotProps<T>, node?: VNodeChild) => VNode,

    icon: boolean,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,

    textFn?: (item: T) => VNodeChild,
    textPropName: string,

    index?: number,
    key?: string,

    actions: VNode | VNode[],
    busy: boolean,

    onDeleted?: (item: T) => void,
    onUpdated?: (item: T) => void,
};

export type ListItemBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListItemBuildOptions<T>>,
never,
'actions' | 'fn' | 'textFn' | 'onDeleted' | 'onUpdated',
'data'
>;
