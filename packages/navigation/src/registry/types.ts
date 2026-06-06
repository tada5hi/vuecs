/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ComputedRef, Ref } from 'vue';
import type { NavigationItemNormalized } from '../types';

export type NavigationRegistryEntry<
    META = any,
> = {
    /**
     * Full resolved tree. Each item carries `.active` (exact current
     * item) and `.activeWithin` (ancestor on the active branch).
     */
    items: Readonly<Ref<NavigationItemNormalized<META>[]>>;
    /**
     * Exact active leaf item(s) — `[]` | `[one]` | `[ties…]`.
     * Single-active consumers read `active.value[0]`.
     */
    active: ComputedRef<NavigationItemNormalized<META>[]>;
    /**
     * Ordered active trail, root → leaf, for the (primary) active item.
     * `activeTrail.value[0]` is the active top-level section,
     * `activeTrail.value.at(-1)` is the active leaf. `[]` when nothing
     * is active.
     */
    activeTrail: ComputedRef<NavigationItemNormalized<META>[]>;
};
