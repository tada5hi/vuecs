/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slot, Slots, VNode } from 'vue';
import { hasOwnProperty } from '../../utils';

/**
 * Returns true if either scoped or unscoped named slot exists
 *
 * @returns {Array|undefined} VNodes
 *
 * @param names
 * @param $slots
 */
export function hasNormalizedSlot(
    names : string[] | string,
    $slots : Slots = {},
) {
    names = Array.isArray(names) ? names : [names];
    // Ensure names is an array
    names = names.filter((name) => name);
    // Returns true if the either a $scopedSlot or $slot exists with the specified name
    return names.some((name) => hasOwnProperty($slots, name));
}

/**
 * Returns VNodes for named slot either scoped or unscoped
 *
 * @param names
 * @param {String} scope
 * @param $slots
 *
 * @returns {Array} VNodes
 */
export function normalizeSlot(
    names : string[] | string,
    scope: Record<string, any> = {},
    $slots : Slots = {},
) : VNode[] | VNode {
    // Ensure names is an array
    names = Array.isArray(names) ? names : [names];
    // Ensure names is an array
    names = names.filter((name) => name);

    let slot : Slot = () => [];

    for (let i = 0; i < names.length && !slot; i++) {
        const name = names[i];
        slot = $slots[name] as Slot;
    }

    return slot(scope);
}
