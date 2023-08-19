/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    hasNormalizedSlot,
    normalizeSlot,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListBodyBuildOptions, ListBodyBuildOptionsInput, ListBodySlotProps } from './type';
import { buildListItem } from '../list-item';

export function buildListBodyOptions<T, M = any>(
    input: ListBodyBuildOptionsInput<T, M>,
) : ListBodyBuildOptions<T, M> {
    const options = buildListBaseOptions(
        input,
        Component.ListBody,
        {
            class: 'list-body',
            tag: 'ul',
        },
    );

    return {
        ...options,

        data: input.data || [],
        item: input.item,
    };
}

export function buildListBody<T, M = any>(
    input?: ListBodyBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = buildListBodyOptions(input);

    let slotProps : ListBodySlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = {
            data: unref(options.data),
            ...options.slotProps,
        };
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            data: unref(options.data),
            ...options.slotProps,
        };
    }

    if (hasNormalizedSlot(SlotName.BODY, options.slotItems)) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            normalizeSlot(SlotName.BODY, slotProps, options.slotItems),
        );
    }

    // ----------------------------------------------------------------------

    const items = unref(options.data);
    if (items.length === 0) {
        return [];
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        items.map((item: T, index) => buildListItem({
            slotProps,
            slotPropsBuilt: true,
            slotItems: options.slotItems,
            ...options.item,
            data: item,
            index,
            busy: options.busy,
        })),
    );
}
