/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, h, unref,
} from 'vue';
import { SlotName } from '../../constants';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import {
    ListItemsBuildOptions, ListItemsBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../../utils';
import { buildListItem } from '../item/module';
import { buildListBaseOptions } from '../utils';

export function buildListItemsOptions<T extends Record<string, any>>(
    input: ListItemsBuildOptionsInput<T>,
) : ListItemsBuildOptions<T> {
    const options = buildListBaseOptions(input, {
        props: {
            class: 'list-items',
        },
    });

    return {
        ...options,

        busy: unrefWithDefault(options.busy, false),

        items: unrefWithDefault(options.items, []),
        item: unrefWithDefault(options.item, {}),
    };
}

export function buildListItems<T extends Record<string, any>>(
    input?: ListItemsBuildOptionsInput<T>,
) : VNode | VNode[] {
    input = input || {};
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