import type { InjectionKey } from 'vue';
import type { NavigationItemNormalized } from '../types';

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

export const NAVIGATION_SELECT_KEY: InjectionKey<NavigationSelectContext> = Symbol('vc-navigation-select');
