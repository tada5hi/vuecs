import type {
    ComponentDefaultValues,
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';

import type { Ref } from 'vue';

/**
 * A single breadcrumb crumb. Consumers may pass a richer object — the
 * `<VCBreadcrumb>` driver is generic over `Item extends BreadcrumbItem`,
 * so the extra fields flow back through the `#item` / `#item-label`
 * slot props while the component only reads the keys declared here.
 */
export type BreadcrumbItem = {
    /** Visible crumb label. */
    label: string;
    /**
     * Route target (vue-router `to`) or path string. When absent (and no
     * `href`), the crumb renders as a non-navigable `<VCBreadcrumbPage>`.
     */
    to?: string | Record<string, unknown>;
    /** Plain `href` for non-router links. Ignored when `to` is set. */
    href?: string;
    /** Leading icon name (resolved by `<VCIcon>` when an icon preset is installed). */
    icon?: string;
    /**
     * Force this crumb to be the current page (`aria-current="page"`).
     * When unset, the last crumb is treated as current.
     */
    current?: boolean;
    /** Genuinely disabled crumb — rendered non-interactive with `aria-disabled="true"`. */
    disabled?: boolean;
};

/**
 * Theme classes for the `breadcrumb` element — covers every part that
 * shares the root theme key (`<nav>`, `<ol>`, the link crumb, the
 * current-page crumb, and the ellipsis). `breadcrumbItem` (the `<li>`)
 * and `breadcrumbSeparator` carry their own keys.
 */
export type BreadcrumbThemeClasses = {
    /** The `<nav aria-label="Breadcrumb">` root. */
    root: string;
    /** The `<ol>` list of crumbs. */
    list: string;
    /** A navigable crumb (`<a>` / `<VCLink>`). */
    link: string;
    /** The current-page or url-less crumb (`<span>`). */
    page: string;
    /** The collapsed-middle ellipsis crumb content. */
    ellipsis: string;
};

export type BreadcrumbItemThemeClasses = {
    /** The per-crumb `<li>` wrapper. */
    root: string;
};

/**
 * Imperative handle for overriding the current (leaf) crumb's label —
 * the one route-scoped seam for dynamic `/:id` page titles. The override
 * auto-clears when the path changes.
 */
export type BreadcrumbLeafHandle = {
    /** Override the leaf crumb's label. */
    set: (label: string) => void;
    /** Clear the override (also cleared automatically on route change). */
    clear: () => void;
};

export type BreadcrumbSeparatorThemeClasses = {
    /** The separator `<li aria-hidden role="presentation">`. */
    root: string;
};

/**
 * Behavioral defaults for the breadcrumb (i18n-friendly). Resolved via
 * `useComponentDefaults('breadcrumb', …)` so they are overridable per
 * instance OR app-wide through `app.use(vuecs, { defaults })`.
 */
export type BreadcrumbDefaults = {
    /** Accessible name for the `<nav>` landmark. */
    label: string;
    /** Icon name for the auto-rendered separator (falls back to `separatorGlyph`). */
    separatorIcon: string;
    /** Glyph used when no `separatorIcon` is resolvable. */
    separatorGlyph: string;
    /** Accessible label for the collapsed-middle ellipsis trigger. */
    ellipsisLabel: string;
    /** Glyph rendered inside the ellipsis crumb. */
    ellipsisGlyph: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        breadcrumb?: ThemeElementDefinition<BreadcrumbThemeClasses>;
        breadcrumbItem?: ThemeElementDefinition<BreadcrumbItemThemeClasses>;
        breadcrumbSeparator?: ThemeElementDefinition<BreadcrumbSeparatorThemeClasses>;
    }



    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ComponentDefaults {
        breadcrumb?: ComponentDefaultValues<BreadcrumbDefaults>;
    }
}

/**
 * Context shared from `<VCBreadcrumb>` to its descendant parts.
 *
 * `themeVariant` (e.g. `{ size: 'sm' }`) propagates to **every** part so a
 * single `<VCBreadcrumb :theme-variant>` resizes the whole trail without
 * repeating the prop. `themeClass` propagates only to parts on the shared
 * `breadcrumb` root key (`<ol>` / link / page / ellipsis); the `<li>` and
 * separator carry their own keys and inherit `themeVariant` only.
 *
 * Optional — parts render bare when mounted outside `<VCBreadcrumb>` (unit
 * tests / ad-hoc composition).
 */
export type BreadcrumbContext = {
    themeClass: () => ThemeClassesOverride<BreadcrumbThemeClasses> | undefined;
    themeVariant: () => VariantValues | undefined;
    /** Nearest-ancestor leaf-label override handle (see `useBreadcrumbLeaf`). */
    leaf: BreadcrumbLeafHandle;
};


export type MinimalRouteRecord = { path?: string; meta?: Record<string, unknown> };

export type MinimalRoute = { path?: string; matched?: MinimalRouteRecord[] };

/**
 * What a route record's `meta.breadcrumb` may hold. A string is shorthand
 * for `{ label }`; a function receives the resolved route. Returning
 * `undefined` / `[]` omits the record from the trail.
 */
export type BreadcrumbMeta =    | string |
    Partial<BreadcrumbItem> |
    BreadcrumbItem[] |
    ((route: MinimalRoute) => BreadcrumbItem | BreadcrumbItem[] | undefined);

export type UseBreadcrumbItemsOptions = {
    /** Prepend a fixed root crumb (e.g. Home) — there is no synthetic Home by default. */
    home?: BreadcrumbItem;
};


/** App-scoped map of `:leaf-id` → leaf handle, for the rare two-breadcrumb case. */
export type BreadcrumbLeafRegistry = Map<string, BreadcrumbLeafHandle>;

/**
 * Opt-in imperative breadcrumb trail. Derivation (registry / route-meta /
 * explicit `:items`) is the default + recommended path — reach for the
 * manager only for genuinely non-route-driven flows (wizard / stack-style
 * UIs) where you push and pop the trail by hand.
 *
 * Bind the reactive `items` into a breadcrumb: destructure so the template
 * unwraps the ref —
 * `const { items, push, pop } = useBreadcrumb()` → `<VCBreadcrumb :items="items">`.
 */
export type BreadcrumbManager = {
    /** Reactive trail. Destructure before binding so the template unwraps it. */
    items: Ref<BreadcrumbItem[]>;
    /** Append a crumb (descend into a child). */
    push: (item: BreadcrumbItem) => void;
    /** Remove and return the last crumb (ascend to the parent). */
    pop: () => BreadcrumbItem | undefined;
    /** Replace the whole trail. */
    replace: (items: BreadcrumbItem[]) => void;
    /** Reset to the initial trail passed at creation. */
    reset: () => void;
};
