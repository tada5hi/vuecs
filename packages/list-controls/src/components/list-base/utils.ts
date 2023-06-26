/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createOptionBuilder } from '@vue-layout/core';
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

    const { buildOrFail } = createOptionBuilder<ListBaseOptions>(
        component,
    );

    return {
        ...options,

        tag: buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: defaults.tag || 'div',
        }),

        slotItems: options.slotItems || {},
        slotProps: buildOrFail({
            key: 'slotProps',
            value: options.slotProps,
            alt: defaults.slotProps || {},
        }),

        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || [],
        }),
        props: buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),
    };
}
