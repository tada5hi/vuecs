import { inject, provide } from '@vuecs/core';
import type { App } from 'vue';
import { useBreadcrumbContext } from './context';
import type { BreadcrumbLeafHandle } from './types';

const BREADCRUMB_LEAF_REGISTRY_SYMBOL = Symbol.for('VCBreadcrumbLeafRegistry');

/** App-scoped map of `:leaf-id` → leaf handle, for the rare two-breadcrumb case. */
export type BreadcrumbLeafRegistry = Map<string, BreadcrumbLeafHandle>;

export function provideBreadcrumbLeafRegistry(
    registry: BreadcrumbLeafRegistry = new Map(),
    app?: App,
): BreadcrumbLeafRegistry {
    provide(BREADCRUMB_LEAF_REGISTRY_SYMBOL, registry, app);
    return registry;
}

export function injectBreadcrumbLeafRegistry(app?: App): BreadcrumbLeafRegistry | undefined {
    return inject<BreadcrumbLeafRegistry>(BREADCRUMB_LEAF_REGISTRY_SYMBOL, app);
}

/**
 * Override the current (leaf) crumb's label — the one imperative seam for
 * dynamic `/:id` page titles. Resolve in page `setup` (e.g. after
 * `useAsyncData`); the override auto-clears when the route changes.
 *
 * Targeting (the "both" decision): with no `id`, the nearest ancestor
 * `<VCBreadcrumb>` is targeted (zero config, the 99% case). Pass an `id`
 * matching a `<VCBreadcrumb :leaf-id>` to disambiguate when two
 * breadcrumbs co-exist (e.g. a layout breadcrumb + a section-local one).
 *
 * ```ts
 * const { set } = useBreadcrumbLeaf();
 * const { data } = await useAsyncData(() => fetchUser(route.params.id));
 * watchEffect(() => data.value && set(data.value.name));
 * ```
 */
export function useBreadcrumbLeaf(id?: string): BreadcrumbLeafHandle {
    if (id != null) {
        const registry = injectBreadcrumbLeafRegistry();
        // Lazy delegation so the handle works even if the target
        // `<VCBreadcrumb :leaf-id>` mounts after this call.
        return {
            set: (label) => registry?.get(id)?.set(label),
            clear: () => registry?.get(id)?.clear(),
        };
    }

    const ctx = useBreadcrumbContext();
    if (!ctx) {
        // Outside a `<VCBreadcrumb>` and no id — no-op rather than throw, so
        // a page `setup` can call it unconditionally.
        return { set: () => {}, clear: () => {} };
    }
    return ctx.leaf;
}
