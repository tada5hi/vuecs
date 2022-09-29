/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, h, mergeProps } from 'vue';
import {
    extractValueFromOptionValueInput, hasNormalizedSlot, normalizeSlot, unrefWithDefault,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import { ListItemsBuildOptions, ListItemsBuildOptionsInput } from './type';
import { buildListItem } from '../list-item';

export function buildListItemsOptions<T extends Record<string, any>>(
    input: ListItemsBuildOptionsInput<T>,
) : ListItemsBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: 'list-items',
    });

    return {
        ...options,

        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),

        data: unrefWithDefault(extractValueFromOptionValueInput(options.data), []),
        item: unrefWithDefault(extractValueFromOptionValueInput(options.item), {}),
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
            data: options.data,
            busy: options.busy,
        }, options.slotItems);
    }

    // ----------------------------------------------------------------------

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        options.data.map((item: T, index) => buildListItem({
            slotProps: options.slotProps,
            slotItems: options.slotItems,
            ...options.item,
            data: item,
            index,
        })),
    );
}
