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

/**
 * Bridges a clicked `<VCNavItem>` up to the owning root `<VCNavItems>`.
 *
 * A url-less item can't navigate, so a click instead "selects" it: the
 * root nav records the item's trace and folds it into its active-state
 * derivation, publishing it through the registry's `active` / `activeTrail`.
 * Dependent navs then react with zero app wiring — exactly as they would
 * for a route-driven active change.
 */
export type NavigationSelectContext = {
    /** Invoke to mark `item` as the selected (active) item of the root nav. */
    select: (item: NavigationItemNormalized) => void;
};
