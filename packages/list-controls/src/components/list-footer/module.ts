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
import { buildListBaseOptions } from '../list-base';
import type { ListFooterBuildOptions, ListFooterBuildOptionsInput } from './type';

export function buildListFooterOptions(
    input: ListFooterBuildOptionsInput,
) : ListFooterBuildOptions {
    const options = buildListBaseOptions(
        input,
        Component.ListFooter,
        {
            class: 'list-footer',
        },
    );

    const { buildOrFail } = createOptionBuilder<ListFooterBuildOptions>(
        Component.ListHeader,
    );

    return {
        ...options,

        content: buildOrFail({
            key: 'content',
            value: options.content,
            alt: [],
        }),
    };
}

export function buildListFooter(
    input?: ListFooterBuildOptionsInput,
) : VNodeChild {
    input = input || {};
    const options = buildListFooterOptions(input);

    let children : VNodeArrayChildren | undefined;

    if (hasNormalizedSlot(SlotName.FOOTER, options.slotItems)) {
        children = [
            normalizeSlot(SlotName.FOOTER, options.slotProps, options.slotItems),
        ];
    } else if (options.content) {
        if (typeof options.content === 'function') {
            children = [options.content(options.slotProps)];
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
