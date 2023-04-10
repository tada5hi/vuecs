/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, mergeProps, unref } from 'vue';
import {
    createOptionValueBuilder,
    extractValueFromOptionValueInput,
    hasNormalizedSlot,
    normalizeSlot,
    unrefWithDefault,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListNoMoreBuildOptions, ListNoMoreBuildOptionsInput } from './type';

export function buildListNoMoreOptions<T extends Record<string, any>>(
    input: ListNoMoreBuildOptionsInput<T>,
) : ListNoMoreBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListNoMore, {
        class: 'list-no-more',
    });

    const { buildOrFail } = createOptionValueBuilder<ListNoMoreBuildOptions<T>>(
        Component.ListNoMore,
    );

    return {
        ...options,

        textContent: buildOrFail({
            key: 'textContent',
            value: unref(options.textContent),
            alt: 'No more items available...',
        }),

        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),
        total: unref(options.total),
    };
}

export function buildListNoMore<T extends Record<string, any>>(
    input?: ListNoMoreBuildOptionsInput<T>,
) {
    input = input || {};

    const options = buildListNoMoreOptions(input);

    if (options.busy) {
        return [];
    }

    if (
        typeof options.total !== 'undefined' &&
        options.total > 0
    ) {
        return [];
    }

    if (hasNormalizedSlot(SlotName.NO_MORE, options.slotItems)) {
        return normalizeSlot(SlotName.NO_MORE, {
            ...options.slotProps,
            busy: options.busy,
            total: options.total,
        }, options.slotItems);
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [
            options.textContent,
        ],
    );
}
