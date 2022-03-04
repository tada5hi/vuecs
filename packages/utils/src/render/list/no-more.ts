/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement } from 'vue';
import { SlotName } from '../constants';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import {
    ComponentListData, ComponentListMethods, ComponentListProperties, NoMoreBuildContext,
} from './type';

export function buildListNoMore<T extends Record<string, any>>(
    instance: ComponentListMethods<T> &
    ComponentListData<T> &
    ComponentListProperties<T> & {
        $scopedSlots: Record<string, any>,
        $slots: Record<string, any>
    },
    h: CreateElement,
    context?: NoMoreBuildContext,
) {
    context = context || {};
    context.text = context.text || 'No more items available...';

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
                normalizeSlot(SlotName.ITEMS_NO_MORE, {}, $scopedSlots, $slots) : context.text,
        ]);
    }

    return node;
}
