/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, VNodeChild } from 'vue';
import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vuecs/core';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';
import type { ListEventFn } from '../type';

export type ListItemSlotProps<T> = Omit<
ListBaseSlotProps<T>,
'updated' | 'created'
> & {
    data: T,
    updated?: ListEventFn<T | undefined>,
    deleted?: ListEventFn<T | undefined>,
    index?: number,
    [key: string]: any
};

export type ListItemChildren = {
    icon?: VNodeChild,
    text?: VNodeChild,
    actions?: VNodeChild,
    slot?: VNodeChild
};

export type ListItemBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    data: MaybeRef<T>,
    content?: VNodeChild | ((
        item: T,
        props: ListItemSlotProps<T>,
        children: ListItemChildren
    ) => VNodeChild),
    index?: number,

    icon: boolean,
    iconTag: string,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,
    iconWrapper: boolean,
    iconWrapperClass: VNodeClass,
    iconWrapperTag: string,

    text: boolean,
    textContent?: VNodeChild | ((item: T, props: ListItemSlotProps<T>) => VNodeChild),
    textPropName: string,
    textWrapper: boolean,
    textWrapperClass: VNodeClass,
    textWrapperTag: string,

    actions: boolean,
    actionsContent: VNodeChild | ((item: T, props: ListItemSlotProps<T>) => VNodeChild),
    actionsWrapper: boolean,
    actionsWrapperClass: VNodeClass,
    actionsWrapperTag: string,
};

export type ListItemBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListItemBuildOptions<T, M>>,
PartialPick<ListItemBuildOptions<T, M>,
'busy'
> &
OptionsInputValue<PartialPick<ListItemBuildOptions<T, M>,
'icon' |
'iconTag' |
'iconClass' |
'iconProps' |
'iconWrapper' |
'iconWrapperClass' |
'iconWrapperTag' |
'text' |
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
