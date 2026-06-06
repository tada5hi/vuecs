/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { computed, ref, shallowReactive } from 'vue';
import type { NavigationItemNormalized } from '../types';
import type { NavigationRegistryEntry } from './types';

type Occupant = {
    token: symbol;
    entry: NavigationRegistryEntry;
};

function createEmptyEntry(): NavigationRegistryEntry {
    const items = ref<NavigationItemNormalized[]>([]);
    return {
        items,
        active: computed(() => []),
        activeTrail: computed(() => []),
    };
}

type NavigationRegistryUnregisterFn = () => void;

/**
 * Reactive, app-wide navigation registry. `<VCNavItems registry>`
 * publishes its resolved output here under a `registry-id`; other navs
 * read it reactively + empty-safe via the resolver context's
 * `registry(id)`.
 *
 * The backing map is `shallowReactive`, so membership changes
 * (register + the returned unregister closure) are tracked dependencies
 * — a consumer reading `get(id)` inside a `computed` / `watchEffect`
 * re-runs when the id's occupancy flips.
 */
export class NavigationRegistry {
    protected map = shallowReactive(
        new Map<string, Occupant>(),
    );

    /**
     * Stable empty entries handed out for absent ids, memoized per id so
     * the SAME reactive handle is returned every call — a consumer
     * subscribed to an absent id keeps its dependency and lights up the
     * moment an occupant registers.
     */
    protected empties = new Map<string, NavigationRegistryEntry>();

    /**
     * Claim `id`. Last-wins: a newer occupant replaces the current one
     * (dev warning on collision). Returns a token-guarded unregister
     * closure: it releases `id` ONLY if this registration is still the
     * occupant. During a route handoff (Vue mounts the new page before
     * unmounting the old) the departing nav's closure holds a stale token
     * and cannot evict the incoming occupant.
     */
    register(id: string, entry: NavigationRegistryEntry): NavigationRegistryUnregisterFn {
        if (this.map.has(id)) {
            // eslint-disable-next-line no-console
            console.warn(`[vuecs] navigation registry id "${id}" reassigned to a new occupant.`);
        }

        const token = Symbol('vc-nav-registry-token');

        this.map.set(id, { token, entry });

        return () => {
            const occupant = this.map.get(id);
            if (occupant && occupant.token === token) {
                this.map.delete(id);
            }
        };
    }

    /** Reactive, empty-safe read. Never returns `undefined`. */
    get<META = any>(id: string): NavigationRegistryEntry<META> {
        const occupant = this.map.get(id);
        if (occupant) {
            return occupant.entry as NavigationRegistryEntry<META>;
        }

        let empty = this.empties.get(id);
        if (!empty) {
            empty = createEmptyEntry();
            this.empties.set(id, empty);
        }

        return empty as NavigationRegistryEntry<META>;
    }

    /** True when an occupant currently holds `id`. */
    has(id: string): boolean {
        return this.map.has(id);
    }
}
