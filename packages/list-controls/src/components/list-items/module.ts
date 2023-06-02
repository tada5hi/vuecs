/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    extendMaybeRefArrayValue,
    extractValueFromOptionValueInput,
    findIndexOfMaybeRefArray,
    hasNormalizedSlot,
    normalizeSlot,
    spliceMaybeRefArray,
    unrefWithDefault,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListItemsBuildOptions, ListItemsBuildOptionsInput, ListItemsSlotProps } from './type';
import { buildListItem } from '../list-item';

export function buildListItemsOptions<T extends Record<string, any>>(
    input: ListItemsBuildOptionsInput<T>,
) : ListItemsBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: 'list-items',
        tag: 'ul',
    });

    return {
        ...options,

        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),

        data: extractValueFromOptionValueInput(options.data) || [],
        item: unrefWithDefault(extractValueFromOptionValueInput(options.item), {}),
    };
}

export function buildListItems<T extends Record<string, any>>(
    input?: ListItemsBuildOptionsInput<T>,
) : VNode | VNode[] {
    input = input || {};
    const options = buildListItemsOptions(input);

    const deleted = (item: T) => {
        const index = findIndexOfMaybeRefArray<T>(
            options.data,
            options.filterFn || ((el) => JSON.stringify(el) === JSON.stringify(item)),
        );

        if (index !== -1) {
            spliceMaybeRefArray(options.data, index, 1);

            if (typeof options.onDeleted === 'function') {
                options.onDeleted(item);
            }
        }
    };

    const updated = (item: T) => {
        const index = findIndexOfMaybeRefArray<T>(
            options.data,
            options.filterFn || ((el) => JSON.stringify(el) === JSON.stringify(item)),
        );

        if (index !== -1) {
            extendMaybeRefArrayValue(options.data, index, item);

            if (typeof options.onUpdated === 'function') {
                options.onUpdated(item);
            }
        }
    };

    if (hasNormalizedSlot(SlotName.ITEMS, options.slotItems)) {
        const slotScope : ListItemsSlotProps<T> = {
            ...options.slotProps,
            data: unref(options.data),
            busy: options.busy,
            deleted,
            updated,
        };

        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            normalizeSlot(SlotName.ITEMS, slotScope, options.slotItems),
        );
    }

    // ----------------------------------------------------------------------

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        unref(options.data).map((item: T, index) => buildListItem({
            slotProps: options.slotProps,
            slotItems: options.slotItems,
            ...options.item,
            data: item,
            index,
            onDeleted: deleted,
            onUpdated: updated,
        })),
    );
}
