/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import { h, mergeProps } from 'vue';
import type { VNode, VNodeArrayChildren } from 'vue';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListHeaderBuildOptions, ListHeaderBuildOptionsInput } from './type';

export function buildListHeaderOptions(
    input: ListHeaderBuildOptionsInput,
) : ListHeaderBuildOptions {
    const options = buildListBaseOptions(
        input,
        Component.ListHeader,
        {
            class: 'list-header',
        },
    );

    return {
        ...options,
    };
}

export function buildListHeader(
    input?: ListHeaderBuildOptionsInput,
) : VNode | VNode[] {
    input = input || {};
    const options = buildListHeaderOptions(input);

    let children : VNodeArrayChildren | undefined;

    if (hasNormalizedSlot(SlotName.HEADER, options.slotItems)) {
        children = [
            normalizeSlot(SlotName.HEADER, options.slotProps, options.slotItems),
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
