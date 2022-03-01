/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement, VNode, VNodeChildrenArrayContents } from 'vue';
import { ComponentListData, ComponentListMethods, ComponentListProperties } from './type';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import { SlotName } from '../constants';

export type ListItemsBuildContext<T> = {
    itemActions?: VNode | VNode[],
    itemClass?: string,
    itemIconClass?: string,
    itemProps?: Record<string, any>,
    itemFn?: (item: T) => VNode | VNode[],
    itemTextFn?: (item: T) => string | VNode | (string | VNode)[],
    itemTextPropName?: string,
    itemsClass?: string
};

export function buildListItems<T extends Record<string, any>>(
    instance: ComponentListMethods<T> &
    ComponentListData<T> &
    ComponentListProperties<T> & {
        $scopedSlots: Record<string, any>,
        $slots: Record<string, any>
    },
    h: CreateElement,
    context?: ListItemsBuildContext<T>,
) : VNode {
    const $scopedSlots = instance.$scopedSlots || {};
    const $slots = instance.$slots || {};

    context = context || {};
    context.itemIconClass = context.itemIconClass || 'fa fa-bars';
    context.itemTextPropName = context.itemTextPropName || 'name';

    const hasItemSlot = hasNormalizedSlot(SlotName.ITEM, $scopedSlots, $slots);
    const itemFnAlt = (item: T) => {
        const itemTextAlt = context?.itemTextPropName ? item[context?.itemTextPropName] : '???';

        let itemActions : VNodeChildrenArrayContents = [];

        if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, $scopedSlots, $slots)) {
            itemActions = normalizeSlot(SlotName.ITEM_ACTIONS, { item, ...(context?.itemProps ? context.itemProps : {}) }, $scopedSlots, $slots);
        } else if (context?.itemActions) {
            itemActions = [
                ...(Array.isArray(context.itemActions) ? context.itemActions : [context.itemActions]) as VNode[],
                hasNormalizedSlot(SlotName.ITEM_ACTIONS_EXTRA, $scopedSlots, $slots) ?
                    normalizeSlot(SlotName.ITEM_ACTIONS_EXTRA, { item, ...(context?.itemProps ? context.itemProps : {}) }, $scopedSlots, $slots) :
                    h(''),
            ];
        }

        return h('div', {
            key: item.id,
            staticClass: context?.itemClass || 'list-item',
        }, [
            h('div', [h('i', { staticClass: context?.itemIconClass })]),
            h('div', [context?.itemTextFn ? context.itemTextFn.call(instance, item) : itemTextAlt]),
            h('div', { staticClass: 'ml-auto' }, itemActions),
        ]);
    };

    const itemFn : (item: T) => VNode | VNode[] = context.itemFn ? context.itemFn : itemFnAlt;

    // ----------------------------------------------------------------------
    const itemsAlt = instance.items.map((item: T) => (hasItemSlot ?
        normalizeSlot(SlotName.ITEM, {
            itemBusy: instance.itemBusy,
            item,
            busy: instance.busy,
            drop: instance.drop,
            ...(context?.itemProps ? context.itemProps : {}),
        }, $scopedSlots, $slots) : itemFn.call(instance, item)));

    const hasItemsSlot = hasNormalizedSlot(SlotName.ITEMS, $scopedSlots, $slots);

    return h(
        'div',
        { staticClass: context.itemsClass || 'list-items' },
        [hasItemsSlot ?
            normalizeSlot(SlotName.ITEMS, {
                items: instance.items,
                busy: instance.busy,
                ...(context?.itemProps ? context.itemProps : {}),
            }, $scopedSlots, $slots) :
            itemsAlt,
        ],
    );
}
