import type { ThemeElementDefinition } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import type { ListEventFn, ListLoadFn } from '../type';

// ---------------------------------------------------------------
// Theme element types (#1485)
// ---------------------------------------------------------------

export type ListThemeClasses = {
    root: string;
};

export type ListHeaderThemeClasses = {
    root: string;
};

export type ListFooterThemeClasses = {
    root: string;
};

export type ListBodyThemeClasses = {
    root: string;
};

export type ListItemThemeClasses = {
    root: string;
    icon: string;
    iconWrapper: string;
    textWrapper: string;
    actionsWrapper: string;
    actionsExtraWrapper: string;
};

export type ListLoadingThemeClasses = {
    root: string;
};

export type ListNoMoreThemeClasses = {
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        list?: ThemeElementDefinition<ListThemeClasses>;
        listHeader?: ThemeElementDefinition<ListHeaderThemeClasses>;
        listFooter?: ThemeElementDefinition<ListFooterThemeClasses>;
        listBody?: ThemeElementDefinition<ListBodyThemeClasses>;
        listItem?: ThemeElementDefinition<ListItemThemeClasses>;
        listLoading?: ThemeElementDefinition<ListLoadingThemeClasses>;
        listNoMore?: ThemeElementDefinition<ListNoMoreThemeClasses>;
    }
}

// ---------------------------------------------------------------
// Slot props types (#1488)
// ---------------------------------------------------------------

export type ListBaseSlotProps<T, M = any> = {
    busy?: boolean;
    total?: number;
    load?: ListLoadFn<M>;
    updated?: ListEventFn<T>;
    deleted?: ListEventFn<T>;
    created?: ListEventFn<T>;
    meta?: M;
    [key: string]: any;
};

export type ListSlotProps<T, M = any> = ListBaseSlotProps<T, M> & {
    data: T[];
    [key: string]: any;
};

export type ListBodySlotProps<T, M = any> = ListBaseSlotProps<T, M> & {
    data: T[];
};

export type ListItemSlotProps<T> = Omit<
    ListBaseSlotProps<T>,
    'updated' | 'created'
> & {
    data: T;
    updated?: ListEventFn<T | undefined>;
    deleted?: ListEventFn<T | undefined>;
    index?: number;
    [key: string]: any;
};

export type ListItemChildren = {
    icon?: VNodeChild;
    text?: VNodeChild;
    actions?: VNodeChild;
    actionsExtra?: VNodeChild;
    slot?: VNodeChild;
};
