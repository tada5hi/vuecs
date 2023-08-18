/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createOptionBuilder, hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import { h, mergeProps } from 'vue';
import type { VNodeChild } from 'vue';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ObjectLiteral } from '../type';
import type { ListHeaderBuildOptions, ListHeaderBuildOptionsInput, ListHeaderSlotProps } from './type';

export function buildListHeaderOptions<T, M = any>(
    input: ListHeaderBuildOptionsInput<T, M>,
) : ListHeaderBuildOptions<T, M> {
    const options = buildListBaseOptions(
        input,
        Component.ListHeader,
        {
            class: 'list-header',
        },
    );

    const { buildOrFail } = createOptionBuilder(
        Component.ListHeader,
    );

    return {
        ...options,

        content: buildOrFail({
            key: 'content',
            value: input.content,
            alt: [],
        }),
    };
}

export function buildListHeader<T, M = any>(
    input?: ListHeaderBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = buildListHeaderOptions(input);

    let slotProps : ListHeaderSlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            ...options.slotProps,
        };
    }

    let content : VNodeChild | undefined;

    if (hasNormalizedSlot(SlotName.HEADER, options.slotItems)) {
        content = normalizeSlot(SlotName.HEADER, slotProps, options.slotItems);
    } else if (options.content) {
        if (typeof options.content === 'function') {
            content = [options.content(slotProps)];
        } else {
            content = [options.content];
        }
    }

    if (content) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            [
                content,
            ],
        );
    }

    return [];
}
