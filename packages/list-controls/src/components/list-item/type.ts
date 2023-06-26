/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from '@vue/runtime-core';
import type { MaybeRef, VNode } from 'vue';
import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListItemSlotProps<T> = {
    data: T,
    busy: boolean,
    index?: number,
    deleted: (item?: T) => any,
    updated: (item: T) => any,
    [key: string]: any
};

export type ListItemChildren = {
    icon?: VNodeChild,
    text?: VNodeChild,
    actions?: VNodeChild,
    slot?: VNodeChild
};

export type ListItemBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    data: MaybeRef<T>,
    fn?: (
        item: T,
        props: ListItemSlotProps<T>,
        children: ListItemChildren
    ) => VNodeChild,

    icon: boolean,
    iconTag: string,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,
    iconWrapper: boolean,
    iconWrapperClass: VNodeClass,
    iconWrapperTag: string,

    textFn?: (item: T) => VNodeChild,
    textPropName: string,
    textWrapper: boolean,
    textWrapperClass: VNodeClass,
    textWrapperTag: string,

    index?: number,
    key?: string,

    actions: boolean,
    actionsContent: VNodeChild,
    actionsWrapper: boolean,
    actionsWrapperClass: VNodeClass,
    actionsWrapperTag: string,

    busy: boolean,

    onDeleted?: (item: T) => any,
    onUpdated?: (item: T) => any,
};

export type ListItemBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsOverride<
ExpectListBaseOptions<ListItemBuildOptions<T>>,
PartialPick<ListItemBuildOptions<T>,
'busy'
> &
OptionsInputValue<PartialPick<ListItemBuildOptions<T>,
'icon' |
'iconTag' |
'iconClass' |
'iconProps' |
'iconWrapper' |
'iconWrapperClass' |
'iconWrapperTag' |
'textWrapper' |
'textWrapperClass' |
'textWrapperTag' |
'actions' |
'actionsContent' |
'actionsWrapper' |
'actionsWrapperClass' |
'actionsWrapperTag' |
'textPropName'>>
>;
