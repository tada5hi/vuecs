/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode } from 'vue';
import {
    OptionsInput,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListItemBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    data: T,
    fn?: (item: T, index?: number) => VNode,

    icon: boolean,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,

    textFn?: (item: T) => string | VNode | (string | VNode)[],
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

export type ListItemSlotProps<T> = {
    data: T,
    busy: boolean,
    index?: number,
    deleted: () => void,
    updated: (item: T) => void,
    [key: string]: any
};
