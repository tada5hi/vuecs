/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BuildInput } from '@trapi/query';
import { VNode, VNodeChildren } from 'vue';
import { PaginationMeta } from '../../components';

export type ComponentListData<T = Record<string, any>> = {
    busy: boolean,
    items: T[],
    q: string,
    meta: PaginationMeta,
    itemBusy: boolean
};

export type ComponentListHandlerMethodOptions<T extends Record<string, any>> = {
    unshift?: boolean,
    filterFn?: (item: T) => boolean,
    emit?: boolean
};

export type ComponentListMethods<T = Record<string, any>> = {
    [key: string]: any,
    load: (data?: PaginationMeta) => Promise<void>,
    handleCreated: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void,
    handleUpdated: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void,
    handleDeleted: (item: T, options?: ComponentListHandlerMethodOptions<T>) => void,
};

export type ComponentListItemData<T = Record<string, any>> = {
    busy: boolean,
    item: T | null,
    loaded?: boolean
};

export type ComponentListProperties<T = Record<string, any>> = {
    query: BuildInput<T>,

    withHeader: boolean,
    withNoMore: boolean,
    withSearch: boolean,
    withPagination: boolean,

    loadOnInit: boolean,
};

// --------------------------------------

export type NoMoreBuildContext = {
    text?: VNodeChildren
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

export type ListHeaderBuildContext = & {
    refreshText?: VNodeChildren,
    titleText?: VNodeChildren,

    iconClass?: string,
};
