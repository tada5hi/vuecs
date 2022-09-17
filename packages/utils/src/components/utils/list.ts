/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { unref } from 'vue';
import { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../type';
import { Component, buildOptionValueOrFail } from '../../options';

export function buildListBaseOptions<
    T extends ListBaseOptionsInput,
    C extends Component,
>(
    options: T,
    component: Component,
    defaults?: {
        [K in keyof ListBaseOptions]?: {
            alt?: ListBaseOptions[K],
            library?: {
                [key: string]: {
                    enabled?: boolean,
                    value?: ListBaseOptions[K]
                }
            },
        }
    },
): ExpectListBaseOptions<T> & ListBaseOptions {
    defaults = defaults || {};

    return {
        ...options,

        tag: buildOptionValueOrFail<Component.ListBase, 'tag'>({
            component: component as Component.ListBase,
            key: 'tag',
            value: unref(options.tag),
            alt: 'div',
            ...defaults.tag,
        }),

        slotItems: options.slotItems || {},
        slotProps: buildOptionValueOrFail<Component.ListBase, 'slotProps'>({
            component: component as Component.ListBase,
            key: 'slotProps',
            value: unref(options.slotProps),
            alt: {},
            ...defaults.slotProps,
        }),

        class: buildOptionValueOrFail<Component.ListBase, 'class'>({
            component: component as Component.ListBase,
            key: 'class',
            value: unref(options.class),
            alt: [],
            ...defaults.class,
        }),
        props: buildOptionValueOrFail<Component.ListBase, 'props'>({
            component: component as Component.ListBase,
            key: 'props',
            value: unref(options.props),
            alt: {},
            ...defaults.props,
        }),
    };
}
