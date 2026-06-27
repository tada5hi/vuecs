import { computed, getCurrentInstance } from 'vue';
import type { ComputedRef } from 'vue';
import type { BreadcrumbItem } from './types';

type MinimalRouteRecord = { path?: string; meta?: Record<string, unknown> };
type MinimalRoute = { path?: string; matched?: MinimalRouteRecord[] };

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

/**
 * The route-meta floor: derive breadcrumb items from `vue-router`'s
 * `route.matched`, reading each record's `meta.breadcrumb`. Soft `$route`
 * lookup (no static `vue-router` import) — router-free apps degrade to
 * `[]` (plus the optional `home`). Pure `computed`, so it is SSR-correct
 * and self-heals on back/forward + deep-link without any push/pop.
 */
export function useBreadcrumbItems(
    options: UseBreadcrumbItemsOptions = {},
): ComputedRef<BreadcrumbItem[]> {
    const globals = getCurrentInstance()?.appContext.config.globalProperties;

    return computed<BreadcrumbItem[]>(() => {
        const route = globals?.$route as MinimalRoute | undefined;
        const out: BreadcrumbItem[] = [];
        if (options.home) {
            out.push(options.home);
        }
        for (const record of route?.matched ?? []) {
            const meta = record.meta?.breadcrumb as BreadcrumbMeta | undefined;
            if (meta == null) {
                continue;
            }
            const resolved = typeof meta === 'function' ? meta(route ?? {}) : meta;
            if (resolved == null) {
                continue;
            }
            const entries = Array.isArray(resolved) ? resolved : [resolved];
            for (const entry of entries) {
                const item = typeof entry === 'string' ? { label: entry } : entry;
                // Only fall back to the record's `path` as a router `to` when the
                // meta entry supplies neither `to` nor `href` — forcing `to` onto
                // an `{ label, href }` entry would break the `BreadcrumbItem`
                // contract (`href` is the secondary, non-router target).
                out.push({
                    ...(item.to == null && item.href == null && record.path ? { to: record.path } : {}),
                    ...item,
                } as BreadcrumbItem);
            }
        }
        return out;
    });
}
