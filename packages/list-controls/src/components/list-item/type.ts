import type { VNodeChild } from 'vue';
import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride, PartialPick,
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

/**
 * Resolved VNode children for a list item, passed to the `content` callback.
 * Each field is only populated when its corresponding option is enabled
 * (e.g. `icon` is set when `icon: true`).
 */
export type ListItemChildren = {
    /** Rendered icon element (when icon: true). */
    icon?: VNodeChild,
    /** Rendered text element (when text: true). */
    text?: VNodeChild,
    /** Primary actions from ITEM_ACTIONS slot or actionsContent (when actions: true). */
    actions?: VNodeChild,
    /** Extra actions from ITEM_ACTIONS_EXTRA slot, rendered in a separate wrapper. */
    actionsExtra?: VNodeChild,
    /** Custom item content from the ITEM / ITEM_DEFAULT slot. Bypasses icon/text/actions. */
    slot?: VNodeChild
};

export type ListItemBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    data: T,
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
    actionsContent?: VNodeChild | ((item: T, props: ListItemSlotProps<T>) => VNodeChild),
    actionsWrapper: boolean,
    actionsWrapperClass: VNodeClass,
    actionsWrapperTag: string,

    actionsExtraWrapper: boolean,
    actionsExtraWrapperClass: VNodeClass,
    actionsExtraWrapperTag: string,
};

export type ListItemBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
ComponentOptionsOverride<
ExpectListBaseOptions<ListItemBuildOptions<T, M>>,
PartialPick<ListItemBuildOptions<T, M>,
'busy'
> &
ComponentOptionsInputValue<PartialPick<ListItemBuildOptions<T, M>,
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
'actionsExtraWrapper' |
'actionsExtraWrapperClass' |
'actionsExtraWrapperTag' |
'textPropName'>>
>;
