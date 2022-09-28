/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, mergeProps } from 'vue';
import { unrefWithDefault } from '@vue-layout/core';
import { Component } from '../constants';
import { buildListBaseOptions } from '../list-base';
import { buildPagination } from '../pagination';
import { ListLoadMeta } from '../type';
import { ListPaginationBuildOptions, ListPaginationBuildOptionsInput } from './type';

export function buildListPaginationOptions<T extends Record<string, any>>(
    input: ListPaginationBuildOptionsInput<T>,
) : ListPaginationBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListPagination, {
        class: {
            alt: 'list-pagination',
        },
    });

    return {
        ...options,

        busy: unrefWithDefault(options.busy, false),

        meta: unrefWithDefault(options.meta, {}),
    };
}

export function buildListPagination<T extends Record<string, any>>(
    input?: ListPaginationBuildOptionsInput<T>,
) {
    input = input || {};
    const options = buildListPaginationOptions(input);

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [
            buildPagination({
                ...options.meta as ListLoadMeta,
                busy: options.busy,
                ...(options.load ? { load: options.load } : { load: () => Promise.resolve() }),
                ...options.props,
            }),
        ],
    );
}
