/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import type { VNode } from 'vue';
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

    return {
        ...options,
    };
}

export function buildListFooter(
    input?: ListFooterBuildOptionsInput,
) : VNode | VNode[] {
    input = input || {};
    const options = buildListFooterOptions(input);

    if (hasNormalizedSlot(SlotName.FOOTER, options.slotItems)) {
        return normalizeSlot(SlotName.FOOTER, options.slotProps, options.slotItems);
    }

    return [];
}
