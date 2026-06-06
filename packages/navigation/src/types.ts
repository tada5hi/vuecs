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
    level?: number;
    name: string;

    url?: string;
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string;

    default?: boolean;
    type?: `${ElementType}`;

    icon?: string;

    active?: boolean;
    activeMatch?: string;

    display?: boolean;
    displayChildren?: boolean;

    children?: NavigationItem[];

    meta?: META;
};

export type NavigationItemNormalized<
    META = any,
> = Omit<NavigationItem<META>, 'name' |
    'level' |
    'children' |
    'meta'> & {
        name: string;
        level: number;
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
> = NavigationItem<META>[] |
    ((ctx: NavigationResolverContext<META>) =>
        NavigationItem<META>[] | Promise<NavigationItem<META>[] | undefined> | undefined);

export type Options = CoreOptions;
