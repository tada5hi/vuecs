/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement, VNode } from 'vue';
import { SlotName } from '../constants';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import {
    ComponentListData, ComponentListMethods, ComponentListProperties,
} from './type';

export type NoMoreContext = {
    hint: string | VNode | (string | VNode)[]
};

export function buildListNoMore<T extends Record<string, any>>(
    instance: ComponentListMethods<T> &
    ComponentListData<T> &
    ComponentListProperties<T> & {
        $scopedSlots: Record<string, any>,
        $slots: Record<string, any>
    },
    h: CreateElement,
    context: NoMoreContext,
) {
    const $scopedSlots = instance.$scopedSlots || {};
    const $slots = instance.$slots || {};

    let node = h();
    if (
        instance.withNoMore &&
        !instance.busy &&
        instance.items.length === 0
    ) {
        const hasNoMoreSlot = hasNormalizedSlot(SlotName.ITEMS_NO_MORE, $scopedSlots, $slots);

        node = h('div', { staticClass: 'list-no-more' }, [
            hasNoMoreSlot ?
                normalizeSlot(SlotName.ITEMS_NO_MORE, {}, $scopedSlots, $slots) : context.hint,
        ]);
    }

    return node;
}
