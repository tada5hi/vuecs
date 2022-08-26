/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, h, unref,
} from 'vue';
import { SlotName } from '../constants';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import {
    ListItemsBuildOptions, ListItemsBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../utils';
import { buildListItem } from './item';

export function buildListItemsOptions<T extends Record<string, any>>(
    options: ListItemsBuildOptionsInput<T>,
) : ListItemsBuildOptions<T> {
    return {
        ...options,

        slotItems: options.slotItems || {},
        slotProps: unrefWithDefault(options.slotProps, {}),

        type: unrefWithDefault(options.type, 'div'),
        props: unrefWithDefault(options.props, {
            class: 'list-items',
        }),

        busy: unrefWithDefault(options.busy, false),

        items: unref(options.items),
        item: unrefWithDefault(options.item, {}),
    };
}

export function buildListItems<T extends Record<string, any>>(
    input: ListItemsBuildOptionsInput<T>,
) : VNode | VNode[] {
    const options = buildListItemsOptions(input);

    if (hasNormalizedSlot(SlotName.ITEMS, options.slotItems)) {
        return normalizeSlot(SlotName.ITEMS, {
            ...options.slotProps,
            items: options.items,
            busy: options.busy,
        }, options.slotItems);
    }

    // ----------------------------------------------------------------------

    return h(
        options.type,
        options.props,
        options.items.map((item: T, index) => buildListItem({
            ...options.slotProps,
            ...options.item,
            data: item,
            index,
        })),
    );
}
