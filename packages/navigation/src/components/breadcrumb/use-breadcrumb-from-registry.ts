import { computed, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { tryInjectNavigationRegistry } from '../../registry';
import type { BreadcrumbItem } from './types';

/**
 * Derive breadcrumb items from a published navigation's `activeTrail`
 * (the ordered root→leaf chain a `<VCNavItems>` exposes via `registry` +
 * `registry-id`). Zero per-page wiring — the trail follows the route and
 * click-selection reactively, and is SSR-correct (it's a pure `computed`).
 *
 * Decoupled on purpose: this is the value-add, not a prerequisite — the
 * plain `<VCBreadcrumb :items>` driver is always the floor. Returns `[]`
 * when no navigation plugin is installed or the id has no occupant yet
 * (`registry.get` is empty-safe).
 *
 * Honest seams: the crumb label comes from the nav item's `name` (a
 * route's dynamic `/:id` title is not in the trail — use
 * `useBreadcrumbLeaf()` for that); url-less section nodes render as
 * non-navigable crumbs.
 */
export function useBreadcrumbFromRegistry(
    id: MaybeRefOrGetter<string>,
): ComputedRef<BreadcrumbItem[]> {
    const registry = tryInjectNavigationRegistry();
    return computed<BreadcrumbItem[]>(() => {
        if (!registry) {
            return [];
        }
        const entry = registry.get(toValue(id));
        return entry.activeTrail.value.map((node) => ({
            label: node.name,
            to: node.url,
            icon: node.icon,
            current: node.active,
        }));
    });
}
