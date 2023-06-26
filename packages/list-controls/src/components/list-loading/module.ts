/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import {
    hasNormalizedSlot,
    normalizeSlot,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListLoadingBuildOptions, ListLoadingBuildOptionsInput } from './type';

export function buildListLoadingOptions<T extends Record<string, any>>(
    input: ListLoadingBuildOptionsInput<T>,
) : ListLoadingBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListLoading, {
        class: 'list-loading',
    });

    return {
        ...options,

        busy: options.busy ?? false,
    };
}

export function buildListLoading<T extends Record<string, any>>(
    input?: ListLoadingBuildOptionsInput<T>,
) : VNodeChild {
    input = input || {};

    const options = buildListLoadingOptions(input);

    if (!options.busy) {
        return [];
    }

    const renderContent = (content?: VNode | VNodeArrayChildren) => h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        content || [],
    );

    if (hasNormalizedSlot(SlotName.LOADING, options.slotItems)) {
        return renderContent(normalizeSlot(SlotName.LOADING, {
            ...options.slotProps,
            busy: options.busy,
        }, options.slotItems));
    }

    return renderContent();
}
