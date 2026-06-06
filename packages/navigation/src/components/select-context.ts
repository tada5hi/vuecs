import type { ComputedRef, InjectionKey } from 'vue';
import type { NavigationItemNormalized } from '../types';

/**
 * Channels a `<VCNavItem>`'s already-normalized + scored `children` down
 * to the nested `<VCNavItems>` that renders its submenu.
 *
 * The top-level nav scores the WHOLE tree once; nested lists must render
 * those results as-is rather than re-resolving / re-scoring a subtree
 * (which would clobber traces and lose whole-tree active context). The
 * nested `<VCNavItems>` reads this when it has no own `data` prop —
 * presence of the injected nodes is what marks it as a nested renderer
 * rather than a resolving root. Each `<VCNavItem>` re-provides its own
 * children, so the value is correctly scoped per nesting level.
 */
export const NAVIGATION_NODES_KEY: InjectionKey<ComputedRef<NavigationItemNormalized[]>> = Symbol('vc-navigation-nodes');

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
