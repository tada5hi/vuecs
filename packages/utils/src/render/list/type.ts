/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slots, VNode, VNodeChild } from 'vue';
import { PaginationMeta } from '../../components';
import { MaybeRef } from '../type';

export type ComponentListData<T = Record<string, any>> = {
    busy: MaybeRef<boolean>,
    items: MaybeRef<T[]>,
    q: MaybeRef<string>,
    meta: MaybeRef<PaginationMeta>,
    itemBusy: MaybeRef<boolean>
};

export type ComponentListHandlerMethodOptions<T extends Record<string, any>> = {
    unshift?: MaybeRef<boolean>,
    filterFn?: (item: T) => boolean,
    emit?: MaybeRef<boolean>
};

export type ComponentListMethods<T = Record<string, any>> = {
    load: (data?: PaginationMeta) => Promise<void>,
    handleCreated: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void,
    handleUpdated: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void,
    handleDeleted: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void
};

export type ComponentListItemData<T = Record<string, any>> = {
    busy: MaybeRef<boolean>,
    item: MaybeRef<T | null>,
    loaded?: MaybeRef<boolean>
};

export type ComponentListProperties<Q> = {
    query: MaybeRef<Q>,

    withHeader: MaybeRef<boolean>,
    withNoMore: MaybeRef<boolean>,
    withSearch: MaybeRef<boolean>,
    withPagination: MaybeRef<boolean>,

    loadOnInit: MaybeRef<boolean>
};

export type ComponentListItemSlotProps<T extends Record<string, any>> = {
    itemBusy: MaybeRef<boolean>,
    item: MaybeRef<T>,
    busy: MaybeRef<boolean>
};

// --------------------------------------

export type ListBaseOptions = {
    $slots: Slots
};
// --------------------------------------

export type ListItemToggleActionContext<
    T extends Record<string, any>,
> = {
    item: T,
    itemPropName?: keyof T,
    busy: boolean,
    propName: string
};

// --------------------------------------

export type NoMoreBuildContext = {
    text?: VNodeChild | VNode | VNode[]
};

export type ListItemsBuildContext<T> = {
    itemActions?: VNode | VNode[],
    itemClass?: string,
    itemIconClass?: string,
    itemSlots?: Record<string, any>,
    itemKey?: string,
    itemFn?: (item: T) => VNode,
    itemTextFn?: (item: T) => string | VNode | (string | VNode)[],
    itemTextPropName?: string,
    itemsClass?: string
};

export type ListHeaderBuildOptions<T extends Record<string, any>> =
    ListBaseOptions &
    {
        refreshText?: VNodeChild | VNode | VNode[],
        titleText?: VNodeChild | VNode | VNode[],

        iconClass?: string,

        properties: ComponentListProperties<T>,
        data: ComponentListData<T>
    };
