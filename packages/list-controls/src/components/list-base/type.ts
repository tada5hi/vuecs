/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, Slots } from 'vue';
import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';
import type {
    ListEventFn, ListItemId, ListItemKey, ListLoadFn, ListMeta,
} from '../type';

export type ListBaseSlotProps<T> = {
    busy?: boolean,
    load?: ListLoadFn,
    updated?: ListEventFn<T>,
    deleted?: ListEventFn<T>,
    created?: ListEventFn<T>,
    meta?: ListMeta,
    [key: string]: any
};

export type ListBaseOptions<T> = {
    slotItems: Slots,
    slotProps: ListBaseSlotProps<T>,
    slotPropsBuilt?: boolean,

    tag: string,
    class: VNodeClass,
    props: VNodeProperties,

    load?: ListLoadFn,
    busy?: MaybeRef<boolean>,
    meta: ListMeta,

    itemId?: ListItemId<T>,
    itemKey?: ListItemKey<T>,

    onCreated?: ListEventFn<T>,
    onDeleted?: ListEventFn<T>,
    onUpdated?: ListEventFn<T>
};
export type ListBaseOptionsInput<T> = OptionsOverride<
ListBaseOptions<T>,
PartialPick<ListBaseOptions<T>, 'meta' | 'slotItems' | 'slotProps'> &
PartialPick<OptionsInputValue<ListBaseOptions<T>>, 'tag' | 'class' | 'props'>
>;

export type ExpectListBaseOptions<T extends Record<string, any>> = Omit<T, keyof ListBaseOptions<T>>;

export type ListBaseOptionsDefaults<T extends Record<string, any>> = {
    [K in keyof ListBaseOptions<T>]?: ListBaseOptions<T>[K]
};
