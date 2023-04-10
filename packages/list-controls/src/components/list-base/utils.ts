/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import { createOptionValueBuilder } from '@vue-layout/core';
import type { Component } from '../constants';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsDefaults, ListBaseOptionsInput,
} from './type';

export function buildListBaseOptions<
    T extends ListBaseOptionsInput,
    C extends Component,
>(
    options: T,
    component: Component,
    defaults?: ListBaseOptionsDefaults,
): ExpectListBaseOptions<T> & ListBaseOptions {
    defaults = defaults || {};

    const { buildOrFail } = createOptionValueBuilder<ListBaseOptions>(
        component,
    );

    return {
        ...options,

        tag: buildOrFail({
            key: 'tag',
            value: unref(options.tag),
            alt: defaults.tag || 'div',
        }),

        slotItems: options.slotItems || {},
        slotProps: buildOrFail({
            key: 'slotProps',
            value: unref(options.slotProps),
            alt: defaults.slotProps || {},
        }),

        class: buildOrFail({
            key: 'class',
            value: unref(options.class),
            alt: defaults.class || [],
        }),
        props: buildOrFail({
            key: 'props',
            value: unref(options.props),
            alt: defaults.props || {},
        }),
    };
}
