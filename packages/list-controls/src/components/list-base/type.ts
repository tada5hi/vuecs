import type { MaybeRef, Slots } from 'vue';
import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
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
    busy?: boolean,
    total?: number,
    load?: ListLoadFn<M>,
    updated?: ListEventFn<T>,
    deleted?: ListEventFn<T>,
    created?: ListEventFn<T>,
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
    busy?: MaybeRef<boolean>,
    total?: MaybeRef<number>,
    meta: M,

    itemId?: ListItemId<T>,
    itemKey?: ListItemKey<T>,

    onCreated?: ListEventFn<T>,
    onDeleted?: ListEventFn<T>,
    onUpdated?: ListEventFn<T>
};
export type ListBaseOptionsInput<T, M = any> = OptionsOverride<
ListBaseOptions<T, M>,
PartialPick<ListBaseOptions<T, M>, 'meta' | 'slotItems' | 'slotProps'> &
PartialPick<OptionsInputValue<ListBaseOptions<T, M>>, 'tag' | 'class' | 'props'>
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
