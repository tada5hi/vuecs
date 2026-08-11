import type { CoreOptions } from '@vuecs/core';
import type { ElementType } from './constants';
import type { NavigationRegistryEntry } from './registry/types';

export type NavigationOrientation = 'horizontal' | 'vertical';

/**
 * How an item with children renders its submenu. `auto` derives from
 * orientation (horizontal → dropdown, otherwise collapse).
 */
export type NavigationSubmenu = 'auto' | 'collapse' | 'dropdown';

/** The resolved submenu presentation (after `auto` is decided). */
export type NavigationSubmenuMode = 'collapse' | 'dropdown';

export type NavigationItem<
    META = any,
> = {
    name: string;

    /**
     * Target of the item's link, and one of the inputs to active matching.
     *
     * **Only a LEAF renders it as a link.** An item that has `children`
     * renders as a submenu trigger (a `<button>`) instead — a link nested
     * inside the trigger would be invalid markup and would swallow the
     * disclosure interaction. An {@link NavigationItem.expanded} group has no
     * trigger at all; its title is inert markup — still not a link. A group
     * that must also be a destination needs a leaf child pointing at it (the
     * conventional "Overview" first child).
     *
     * On a group the url is still meaningful: `findBestItemMatches` scores
     * every item and a group's score seeds its children's, so a group url is
     * how a whole branch is kept on the active trail for nested paths.
     */
    url?: string;
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string;

    default?: boolean;
    type?: `${ElementType}`;

    icon?: string;

    active?: boolean;
    activeMatch?: string;

    /**
     * Render this item's children expanded, permanently — independent of
     * which item is active. The submenu is presented as a plain always-open
     * section instead of a collapsible: no trigger, nothing to toggle.
     *
     * For a sidebar group that should read as a titled section rather than a
     * disclosure. Ignored in `dropdown` submenu mode, where a flyout has no
     * meaningful always-open state.
     *
     * **Scoped to this group's own children — it does NOT force ancestors
     * open.** Nested inside a collapsed group, the section renders once that
     * ancestor is opened, and renders already-open. Propagating upwards would
     * let a declaration on a deep group pin its whole ancestor chain open on
     * first paint, overriding the active-trail collapse the chain otherwise
     * follows.
     *
     * Contrast with {@link NavigationItem.displayChildren}, which is DERIVED
     * per resolve from the active trail and is overwritten on every pass.
     */
    expanded?: boolean;

    display?: boolean;

    /**
     * Whether the submenu is open.
     *
     * **Output, not input.** Recomputed from the active trail on every
     * resolve, so a value set on a source item is always overwritten. To open
     * a group by declaration, use {@link NavigationItem.expanded}.
     */
    displayChildren?: boolean;

    children?: NavigationItem[];

    meta?: META;
};

export type NavigationItemNormalized<
    META = any,
> = Omit<NavigationItem<META>, 'name' |
    'children' |
    'meta'> & {
        name: string;
        children: NavigationItemNormalized<META>[];

        /** Ancestor of the active leaf (excludes the exact active item). */
        activeWithin?: boolean;

        trace: string[];
        meta: META;
    };

/**
 * Reactive, empty-safe access to another nav's published output, by
 * registry id. Returns a stable entry even when `id` is not (yet)
 * registered.
 */
export type NavigationResolverContext<
    META = any,
> = {
    /** Current path used for active matching. */
    path: string | undefined;
    /** Reactive, empty-safe read of another nav's published output. */
    registry: (id: string) => NavigationRegistryEntry<META>;
};

/**
 * The source of a `<VCNavItems>`' items. Plain array, sync fn, or async
 * fn. A fn receives a {@link NavigationResolverContext} and may read
 * reactive state freely — the nav re-runs it automatically when that
 * state changes.
 */
export type NavigationResolver<
    META = any,
> = ((ctx: NavigationResolverContext<META>) =>
        NavigationItem<META>[] | Promise<NavigationItem<META>[] | undefined> | undefined);

export type Options = CoreOptions;
