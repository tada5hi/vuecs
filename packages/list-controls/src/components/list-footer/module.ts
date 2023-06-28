/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createOptionBuilder, hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import { h, mergeProps } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListFooterBuildOptions, ListFooterBuildOptionsInput, ListFooterSlotProps } from './type';

export function buildListFooterOptions<T extends Record<string, any> = Record<string, any>>(
    input: ListFooterBuildOptionsInput<T>,
) : ListFooterBuildOptions<T> {
    const options = buildListBaseOptions(
        input,
        Component.ListFooter,
        {
            class: 'list-footer',
        },
    );

    const { buildOrFail } = createOptionBuilder<ListFooterBuildOptions<T>>(
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

export function buildListFooter<
    T extends Record<string, any> = Record<string, any>,
>(
    input?: ListFooterBuildOptionsInput<T>,
) : VNodeChild {
    input = input || {};
    const options = buildListFooterOptions(input);

    let slotProps : ListFooterSlotProps<T>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T>(options),
            ...options.slotProps,
        };
    }

    let children : VNodeArrayChildren | undefined;

    if (hasNormalizedSlot(SlotName.FOOTER, options.slotItems)) {
        children = [
            normalizeSlot(SlotName.FOOTER, slotProps, options.slotItems),
        ];
    } else if (options.content) {
        if (typeof options.content === 'function') {
            children = [options.content(slotProps)];
        } else {
            children = [options.content];
        }
    }

    if (children) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            [
                children,
            ],
        );
    }

    return [];
}
