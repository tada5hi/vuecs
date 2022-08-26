/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import { Pagination } from '../../components/Pagination';
import {
    ListPaginationBuildOptions,
    ListPaginationBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../utils';

export function buildListPaginationOptions<T extends Record<string, any>>(
    options: ListPaginationBuildOptionsInput<T>,
) : ListPaginationBuildOptions<T> {
    return {
        ...options,

        load: (() => Promise.resolve()),

        type: unrefWithDefault(options.type, 'div'),
        props: unrefWithDefault(options.props, {
            class: 'list-pagination',
        }),

        slotItems: options.slotItems || {},
        slotProps: unrefWithDefault(options.slotProps, {}),

        busy: unrefWithDefault(options.busy, false),

        items: unref(options.items),
        meta: unref(options.meta),
    };
}

export function buildListPagination<T extends Record<string, any>>(
    input: ListPaginationBuildOptionsInput<T>,
) {
    const options = buildListPaginationOptions(input);

    return h(
        options.type,
        options.props,
        [
            h(Pagination, {
                ...options.meta,
                busy: options.busy,
                onLoad: options.load,
                ...options.props,
            }),
        ],
    );
}
