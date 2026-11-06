import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { Component, PropType, WatchSource } from 'vue';

import type {
    NavigationItem,
    NavigationOrientation,
    NavigationResolver,
    NavigationSubmenu,
} from '../../types';
import type { NavigationThemeClasses } from '../../helpers/component/types';

export const navItemsProps = {
    /**
     * The source of this nav's items. Plain array, sync fn, or async fn.
     * A fn receives a NavigationResolverContext and may read reactive
     * state freely — the nav re-runs it automatically when that state
     * changes.
     *
     * When omitted, the nav checks whether it is a nested submenu of a
     * parent `<VCNavItem>` (via the {@link NAVIGATION_NODES_KEY} inject)
     * and, if so, renders that parent's already-scored children as-is.
     */
    data: {
        type: [Array, Function] as PropType<NavigationItem[] | NavigationResolver>,
        default: undefined,
    },
    /** Opt in to publishing this nav's resolved output into the registry. */
    registry: { type: Boolean, default: false },
    /** The key under which to publish. Required when `registry` is true. */
    registryId: { type: String, default: undefined },
    /**
     * Current path for active-state matching. When omitted, the nav softly
     * reads vue-router's current route (via the `$route` global property)
     * if a router is installed; router-free apps simply get `undefined`.
     */
    path: { type: String, default: undefined },
    /**
     * Extra reactive deps that should retrigger the resolver — for state
     * read only AFTER the first `await` in an async resolver (auto-track
     * can't see past an await).
     */
    watch: { type: Array as PropType<WatchSource[]>, default: undefined },
    variant: { type: String, default: undefined },
    orientation: { type: String as PropType<NavigationOrientation>, default: undefined },
    /**
     * How items with children render their submenu. `auto` derives from
     * orientation (horizontal → dropdown, otherwise collapse).
     */
    submenu: { type: String as PropType<NavigationSubmenu>, default: 'auto' },
    /**
     * The tag (or component) for this nav's list container. Defaults to
     * `'ul'`. Forwarded unchanged to every nesting level so the whole tree
     * renders the same container tag. Honored in collapse mode only —
     * dropdown mode keeps Reka's NavigationMenu primitives.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'ul' },
    /**
     * The tag (or component) for each item wrapper. Defaults to `'li'`.
     * Forwarded unchanged to every nesting level. Honored in collapse mode
     * only — dropdown mode keeps Reka's NavigationMenu primitives.
     */
    itemAs: { type: [String, Object, Function] as PropType<string | Component>, default: 'li' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};
