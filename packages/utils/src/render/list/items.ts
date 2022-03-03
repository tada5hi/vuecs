/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement, VNode, VNodeChildren } from 'vue';
import { ComponentListData, ComponentListMethods, ComponentListProperties } from './type';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import { SlotName } from '../constants';

export type ListItemsBuildContext<T> = {
    itemActions?: VNode | VNode[],
    itemClass?: string,
    itemIconClass?: string,
    itemSlots?: Record<string, any>,
    itemKey?: string,
    itemFn?: (item: T) => VNode,
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
    const itemFnAlt = (item: T) : VNode => {
        const itemTextAlt = context?.itemTextPropName ? item[context?.itemTextPropName] : '???';

        let itemActions : VNodeChildren = [];

        if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, $scopedSlots, $slots)) {
            itemActions = normalizeSlot(SlotName.ITEM_ACTIONS, { item, ...(context?.itemSlots ? context.itemSlots : {}) }, $scopedSlots, $slots);
        } else if (context?.itemActions) {
            itemActions = [
                ...(Array.isArray(context.itemActions) ? context.itemActions : [context.itemActions]) as VNode[],
                hasNormalizedSlot(SlotName.ITEM_ACTIONS_EXTRA, $scopedSlots, $slots) ?
                    normalizeSlot(SlotName.ITEM_ACTIONS_EXTRA, { item, ...(context?.itemSlots ? context.itemSlots : {}) }, $scopedSlots, $slots) :
                    h(''),
            ];
        }

        return h('div', { staticClass: 'd-flex flex-row' }, [
            h('div', [h('i', { staticClass: context?.itemIconClass })]),
            h('div', [context?.itemTextFn ? context.itemTextFn.call(instance, item) : itemTextAlt]),
            h('div', { staticClass: 'ml-auto' }, itemActions),
        ]);
    };

    const itemFn : (item: T) => VNode = context.itemFn ? context.itemFn : itemFnAlt;

    // ----------------------------------------------------------------------

    const itemsAlt = instance.items.map((item: T, index) => {
        let key = index;
        const itemKey = context?.itemKey || 'id';
        if (Object.prototype.hasOwnProperty.call(item, itemKey)) {
            key = item[itemKey];
        }

        return h(
            'div',
            {
                key,
                staticClass: context?.itemClass || 'list-item',
            },
            [
                (hasItemSlot ?
                    normalizeSlot(SlotName.ITEM, {
                        itemBusy: instance.itemBusy,
                        item,
                        busy: instance.busy,
                        drop: instance.drop,
                        ...(context?.itemSlots ? context.itemSlots : {}),
                    }, $scopedSlots, $slots) :
                    itemFn.call(instance, item)
                ),
            ],
        );
    });

    const hasItemsSlot = hasNormalizedSlot(SlotName.ITEMS, $scopedSlots, $slots);

    return h(
        'div',
        { staticClass: context.itemsClass || 'list-items' },
        [hasItemsSlot ?
            normalizeSlot(SlotName.ITEMS, {
                items: instance.items,
                busy: instance.busy,
                ...(context?.itemSlots ? context.itemSlots : {}),
            }, $scopedSlots, $slots) :
            itemsAlt,
        ],
    );
}
