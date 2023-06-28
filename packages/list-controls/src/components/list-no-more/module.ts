/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    createOptionBuilder,
    hasNormalizedSlot,
    normalizeSlot,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListNoMoreBuildOptions, ListNoMoreBuildOptionsInput, ListNoMoreSlotProps } from './type';

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

        content: buildOrFail({
            key: 'content',
            value: input.content,
            alt: 'No more items available...',
        }),
    };
}

export function buildListNoMore<T extends Record<string, any>>(
    input?: ListNoMoreBuildOptionsInput<T>,
) : VNodeChild {
    input = input || {};

    const options = buildListNoMoreOptions(input);

    const busy = unref(options.busy);
    const { meta } = options;

    if (busy) {
        return [];
    }

    if (
        typeof meta.total === 'number' &&
        meta.total > 0
    ) {
        return [];
    }

    let slotProps : ListNoMoreSlotProps<T>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T>(options),
            ...options.slotProps,
        };
    }

    const renderContent = (content?: VNodeChild) : VNodeChild => h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [content],
    );

    if (hasNormalizedSlot(SlotName.NO_MORE, options.slotItems)) {
        return renderContent(normalizeSlot(SlotName.NO_MORE, slotProps, options.slotItems));
    }

    if (typeof options.content === 'function') {
        return renderContent(options.content(slotProps));
    }

    return renderContent(options.content);
}
