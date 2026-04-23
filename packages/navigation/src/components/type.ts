import type { NavigationItemNormalized } from '../types';

export type NavItemSelectFn<META = any> = (
    value: NavigationItemNormalized<META>,
) => Promise<void>;

export type NavItemToggleFn<META = any> = (
    value: NavigationItemNormalized<META>,
) => Promise<void>;

export type NavItemSeparatorSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
};

export type NavItemLinkSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
    select: NavItemSelectFn<META>;
    isActive?: boolean;
};

export type NavItemSubSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
    select: NavItemSelectFn<META>;
    toggle: NavItemToggleFn<META>;
};

export type NavItemSubTitleSlotProps<META = any> = NavItemSubSlotProps<META>;

export type NavItemSubItemsSlotProps<META = any> = NavItemSubSlotProps<META>;

export type NavItemsItemSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
};
