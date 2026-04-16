import type { Slots } from 'vue';
import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride, 
    PartialPick,
    VNodeClass,
    VNodeProperties,
} from '@vuecs/core';
import type {
    ListEventFn,
    ListItemId,
    ListItemKey,
    ListLoadFn,
    ObjectLiteral,
} from '../type';

export type ListBaseSlotProps<T, M = any> = {
    /** Whether the list is currently loading data. */
    busy?: boolean,
    /** Convenience total count. Equivalent to meta.total when using paginated responses. */
    total?: number,
    /** Trigger a (re)load. Accepts optional meta (e.g. pagination params). */
    load?: ListLoadFn<M>,
    /** Callback invoked when an existing item is updated. Provided via onUpdated option. */
    updated?: ListEventFn<T>,
    /** Callback invoked when an item is deleted. Provided via onDeleted option. */
    deleted?: ListEventFn<T>,
    /** Callback invoked when a new item is created. Provided via onCreated option. */
    created?: ListEventFn<T>,
    /** Arbitrary metadata (e.g. pagination info). */
    meta?: M,
    [key: string]: any
};

export type ListBaseOptions<T, M = any> = {
    slotItems: Slots,
    slotProps: ListBaseSlotProps<T, M>,
    slotPropsBuilt?: boolean,

    tag: string,
    class: VNodeClass,
    props: VNodeProperties,

    load?: ListLoadFn<M>,
    busy?: boolean,
    total?: number,
    meta: M,

    itemId?: ListItemId<T>,
    itemKey?: ListItemKey<T>,

    onCreated?: ListEventFn<T>,
    onDeleted?: ListEventFn<T>,
    onUpdated?: ListEventFn<T>
};
export type ListBaseOptionsInput<T, M = any> = ComponentOptionsOverride<
    ListBaseOptions<T, M>,
PartialPick<ListBaseOptions<T, M>, 'meta' | 'slotItems' | 'slotProps'> &
PartialPick<ComponentOptionsInputValue<ListBaseOptions<T, M>>, 'tag' | 'class' | 'props'>
>;

export type ExpectListBaseOptions<
    T extends ObjectLiteral,
    M = any,
> = Omit<T, keyof ListBaseOptions<T, M>>;

export type ListBaseOptionsDefaults<
    T extends ObjectLiteral,
    M = any,
> = {
    [K in keyof ListBaseOptions<T, M>]?: ListBaseOptions<T, M>[K]
};
