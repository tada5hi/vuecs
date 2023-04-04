/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, mergeProps } from 'vue';
import {
    extractValueFromOptionValueInput,
    hasNormalizedSlot,
    normalizeSlot,
    unrefWithDefault,
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

        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),
    };
}

export function buildListLoading<T extends Record<string, any>>(
    input?: ListLoadingBuildOptionsInput<T>,
) {
    input = input || {};

    const options = buildListLoadingOptions(input);

    if (!options.busy) {
        return [];
    }

    if (hasNormalizedSlot(SlotName.LOADING, options.slotItems)) {
        return normalizeSlot(SlotName.LOADING, {
            ...options.slotProps,
            busy: options.busy,
        }, options.slotItems);
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [],
    );
}
