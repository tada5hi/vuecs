import type { NavigationItemNormalized } from '../types';

/**
 * Invoke to select this item: its trace is folded into the owning root
 * `<VCNavItems>`'s active state and republished through the registry.
 * The leaf link calls this on click; expose it on custom `#link` slots
 * to drive url-less section switchers from bespoke markup.
 */
export type NavItemSelectFn = () => void;

/** Invoke to toggle this item's expanded state. */
export type NavItemToggleFn = () => void;

export type NavItemSeparatorSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
};

export type NavItemLinkSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
    select: NavItemSelectFn;
    isActive?: boolean;
};

export type NavItemSubSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
    select: NavItemSelectFn;
    toggle: NavItemToggleFn;
};

export type NavItemSubTitleSlotProps<META = any> = NavItemSubSlotProps<META>;

export type NavItemSubItemsSlotProps<META = any> = NavItemSubSlotProps<META>;

export type NavItemsItemSlotProps<META = any> = {
    data: NavigationItemNormalized<META>;
};
