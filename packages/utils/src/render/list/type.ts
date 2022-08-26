/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slots, VNode, VNodeChild } from 'vue';
import { PaginationMeta } from '../../components';
import { VNodeProperties } from '../../type';
import { OptionsInput } from '../type';

export type ComponentListLoadFn = (data?: PaginationMeta) => Promise<void>;

// --------------------------------------

export type ListBaseOptions = {
    slotItems: Slots,
    slotProps: Record<string, any>,

    type: string,
    props: VNodeProperties,
};

// --------------------------------------

export type ListSearchBuildOptions = ListBaseOptions & {
    q: string
};

export type ListSearchBuildOptionsInput = OptionsInput<
ListSearchBuildOptions,
'q',
'slotItems'
>;

// --------------------------------------

export type ListPaginationBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    meta: PaginationMeta,
    busy: boolean,
    items: T[],
    load: ComponentListLoadFn
};

export type ListPaginationBuildOptionsInput<T> = OptionsInput<
ListPaginationBuildOptions<T>,
'load',
'slotItems',
'items' | 'meta'
>;

// --------------------------------------

export type ListNoMoreBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    textContent: VNodeChild | VNode | VNode[],

    busy: boolean,
    items: T[]
};

export type ListNoMoreBuildOptionsInput<T> = OptionsInput<
ListNoMoreBuildOptions<T>,
never,
'slotItems' | 'textContent',
'items'
>;

// --------------------------------------

export type ListItemsBuildOptions<T> = ListBaseOptions & {
    busy: boolean,

    item: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    items: T[],
};

export type ListItemsBuildOptionsInput<T> = OptionsInput<
ListItemsBuildOptions<T>,
never,
'slotItems',
'items'
>;

// --------------------------------------

export type ListItemBuildOptions<T> = ListBaseOptions & {
    data: T,
    fn?: (item: T, index?: number) => VNode,

    icon: boolean,
    iconProps: VNodeProperties,

    textFn?: (item: T) => string | VNode | (string | VNode)[],
    textPropName: string,

    index?: number,
    key?: string,

    actions: VNode | VNode[],
    busy: boolean
};

export type ListItemBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ListItemBuildOptions<T>,
'data',
'slotItems' | 'actions' | 'fn' | 'textFn'
>;

// --------------------------------------

export type ListTitleBuildOptions<T extends Record<string, any>> = {
    slotItems: Slots,

    text: boolean,
    textProps: VNodeProperties,
    textContent: VNodeChild | VNode | VNode[],

    icon: boolean,
    iconProps: VNodeProperties
};

export type ListTitleBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ListTitleBuildOptions<T>,
never,
'slotItems' | 'textContent'
>;

export type ListActionRefreshBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    text: boolean,
    textContent: VNodeChild | VNode | VNode[],

    icon: boolean,
    iconProps: VNodeProperties,

    busy: boolean,
    load: ComponentListLoadFn,
};

export type ListActionRefreshOptionsInput<T extends Record<string, any>> = OptionsInput<
ListActionRefreshBuildOptions<T>,
never,
'slotItems' | 'load' | 'textContent'
>;

// --------------------------------------

export type ListHeaderBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    actionType: string,
    actionProps: VNodeProperties,
    actionRefresh: ListActionRefreshOptionsInput<T> | boolean,

    title: ListTitleBuildOptionsInput<T> | boolean,

    // slot scope
    busy: boolean,
    load: ComponentListLoadFn
};

export type ListHeaderBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ListHeaderBuildOptions<T>,
never,
'slotItems' | 'load'
>;
