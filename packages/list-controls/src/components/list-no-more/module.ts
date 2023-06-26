/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import {
    createOptionBuilder,
    hasNormalizedSlot,
    normalizeSlot,
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

    const { buildOrFail } = createOptionBuilder<ListNoMoreBuildOptions<T>>(
        Component.ListNoMore,
    );

    return {
        ...options,

        textContent: buildOrFail({
            key: 'textContent',
            value: options.textContent,
            alt: 'No more items available...',
        }),

        busy: options.busy ?? false,
        total: options.total,
    };
}

export function buildListNoMore<T extends Record<string, any>>(
    input?: ListNoMoreBuildOptionsInput<T>,
) : VNodeChild {
    input = input || {};

    const options = buildListNoMoreOptions(input);

    if (options.busy) {
        return [];
    }

    const { total } = options;

    if (
        typeof total === 'number' &&
        total > 0
    ) {
        return [];
    }

    const renderContent = (content?: VNode | VNodeArrayChildren) => h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        content,
    );

    if (hasNormalizedSlot(SlotName.NO_MORE, options.slotItems)) {
        return renderContent(normalizeSlot(SlotName.NO_MORE, {
            ...options.slotProps,
            busy: options.busy,
            total: options.total,
        }, options.slotItems));
    }

    return renderContent([options.textContent]);
}
