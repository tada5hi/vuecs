/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import { SlotName } from '../constants';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import {
    ListNoMoreBuildOptions, ListNoMoreBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../utils';
import { buildListBaseOptions } from './utils';

export function buildListNoMoreOptions<T extends Record<string, any>>(
    input: ListNoMoreBuildOptionsInput<T>,
) : ListNoMoreBuildOptions<T> {
    const options = buildListBaseOptions(input, {
        props: {
            class: 'list-no-more',
        },
    });

    return {
        ...options,

        textContent: unrefWithDefault(options.textContent, 'No more items available...'),

        busy: unrefWithDefault(options.busy, false),
        items: unref(options.items),
    };
}

export function buildListNoMore<T extends Record<string, any>>(
    input: ListNoMoreBuildOptionsInput<T>,
) {
    const options = buildListNoMoreOptions(input);

    if (
        !options.busy &&
        options.items.length === 0
    ) {
        return h('');
    }

    if (hasNormalizedSlot(SlotName.ITEMS_NO_MORE, options.slotItems)) {
        return normalizeSlot(SlotName.ITEMS_NO_MORE, {
            ...options.slotProps,
            busy: options.busy,
            items: options.items,
        }, options.slotItems);
    }

    return h(options.type, options.props, [
        options.textContent,
    ]);
}
