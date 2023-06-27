/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    extendMaybeRefArrayValue,
    findIndexOfMaybeRefArray,
    hasNormalizedSlot,
    hasOwnProperty,
    normalizeSlot,
    spliceMaybeRefArray,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListBodyBuildOptions, ListBodyBuildOptionsInput, ListBodySlotProps } from './type';
import { buildListItem } from '../list-item';

export function buildListBodyOptions<T extends Record<string, any>>(
    input: ListBodyBuildOptionsInput<T>,
) : ListBodyBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: 'list-items',
        tag: 'ul',
    });

    return {
        ...options,

        busy: options.busy ?? false,

        data: options.data || [],
        item: options.item,
    };
}

type FilterFn<T extends Record<string, any>> = (item: T, index?: number) => boolean;

export function buildListBody<T extends Record<string, any>>(
    input?: ListBodyBuildOptionsInput<T>,
) : VNodeChild {
    input = input || {};
    const options = buildListBodyOptions(input);

    const buildFilterFn = (item: T) : FilterFn<T> | undefined => {
        let filterFn : FilterFn<T> | undefined;
        if (options.itemId) {
            const { itemId } = options;
            filterFn = (el) => itemId(el) === itemId(item);
        }

        if (options.itemKey) {
            const { itemKey } = options;
            filterFn = (el) => el[itemKey] === item[itemKey];
        }

        if (
            !filterFn &&
            hasOwnProperty(item, 'id')
        ) {
            filterFn = (el) => options && el['id' as keyof T] === item['id' as keyof T];
        }

        return filterFn;
    };

    const deleted = (item: T) => {
        const filterFn = buildFilterFn(item);

        if (filterFn) {
            const index = findIndexOfMaybeRefArray<T>(
                options.data,
                filterFn,
            );

            if (index !== -1) {
                spliceMaybeRefArray(options.data, index, 1);
            }
        }

        if (typeof options.onDeleted === 'function') {
            options.onDeleted(item);
        }
    };

    const updated = (item: T) => {
        const filterFn = buildFilterFn(item);

        if (filterFn) {
            const index = findIndexOfMaybeRefArray<T>(
                options.data,
                filterFn,
            );

            if (index !== -1) {
                extendMaybeRefArrayValue(options.data, index, item);
            }
        }

        if (typeof options.onUpdated === 'function') {
            options.onUpdated(item);
        }
    };

    if (hasNormalizedSlot(SlotName.BODY, options.slotItems)) {
        const slotScope : ListBodySlotProps<T> = {
            ...options.slotProps,
            data: unref(options.data),
            busy: options.busy,
            deleted,
            updated,
        };

        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            normalizeSlot(SlotName.BODY, slotScope, options.slotItems),
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
            busy: options.busy,
        })),
    );
}
