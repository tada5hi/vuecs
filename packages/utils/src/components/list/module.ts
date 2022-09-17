/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNodeArrayChildren, h, mergeProps, unref,
} from 'vue';
import { Component, buildOptionValueOrFail } from '../../options';
import { ListHeaderBuildOptionsInput, buildListHeader } from '../list-header';
import { ListItemsBuildOptionsInput, buildListItems } from '../list-items';
import { ListNoMoreBuildOptionsInput, buildListNoMore } from '../list-no-more';
import { ListPaginationBuildOptionsInput, buildListPagination } from '../list-pagination';
import { ListSearchBuildOptionsInput, buildListSearch } from '../list-search';
import { buildListBaseOptions } from '../utils';
import { ListBuildOptions, ListBuildOptionsInput } from './type';

export function buildListOptions<T extends Record<string, any>>(
    input: ListBuildOptionsInput<T>,
) : ListBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: {
            alt: 'list',
        },
    });

    return {
        ...options,

        load: input.load,
        busy: options.busy,
        data: options.data,
        meta: options.meta,

        header: buildOptionValueOrFail({
            component: Component.List,
            key: 'header',
            value: unref(options.header),
            alt: true,
        }),
        search: buildOptionValueOrFail({
            component: Component.List,
            key: 'search',
            value: unref(options.search),
            alt: true,
        }),
        items: buildOptionValueOrFail({
            component: Component.List,
            key: 'items',
            value: unref(options.items),
            alt: true,
        }),
        noMore: buildOptionValueOrFail({
            component: Component.List,
            key: 'noMore',
            value: unref(options.noMore),
            alt: true,
        }),
        pagination: buildOptionValueOrFail({
            component: Component.List,
            key: 'pagination',
            value: unref(options.pagination),
            alt: true,
        }),
    };
}

export function buildList<T extends Record<string, any>>(
    input: ListBuildOptionsInput<T>,
) {
    const options = buildListOptions(input);

    const children : VNodeArrayChildren = [];

    if (options.header) {
        const headerOptions : ListHeaderBuildOptionsInput = typeof options.header === 'boolean' ?
            {} :
            options.header;

        headerOptions.load = options.load;
        headerOptions.busy = options.busy;
        headerOptions.slotItems = options.slotItems;
        headerOptions.slotProps = options.slotProps;

        const header = buildListHeader(headerOptions);
        children.push(header);
    }

    if (options.search) {
        const searchOptions : ListSearchBuildOptionsInput = typeof options.search === 'boolean' ?
            {} :
            options.search;

        searchOptions.change = options.change;
        searchOptions.slotItems = options.slotItems;
        searchOptions.slotProps = options.slotProps;

        const search = buildListSearch(searchOptions);
        children.push(search);
    }

    if (options.items) {
        const itemsOptions : ListItemsBuildOptionsInput<T> = typeof options.items === 'boolean' ?
            {} :
            options.items;

        itemsOptions.data = options.data;
        itemsOptions.busy = options.busy;
        itemsOptions.slotItems = options.slotItems;
        itemsOptions.slotProps = options.slotProps;

        const items = buildListItems(itemsOptions);
        children.push(items);
    }

    if (options.noMore) {
        const noMoreOptions : ListNoMoreBuildOptionsInput<T> = typeof options.noMore === 'boolean' ?
            {} :
            options.noMore;

        noMoreOptions.busy = options.busy;
        noMoreOptions.slotItems = options.slotItems;
        noMoreOptions.slotProps = options.slotProps;
        const meta = unref(options.meta);
        if (meta) {
            noMoreOptions.total = meta.total;
        }

        const noMore = buildListNoMore(noMoreOptions);
        children.push(noMore);
    }

    if (options.pagination) {
        const paginationOptions : ListPaginationBuildOptionsInput<T> = typeof options.pagination === 'boolean' ?
            {} :
            options.pagination;

        paginationOptions.busy = options.busy;
        paginationOptions.meta = options.meta;
        paginationOptions.load = options.load;
        paginationOptions.slotItems = options.slotItems;
        paginationOptions.slotProps = options.slotProps;

        const pagination = buildListPagination(paginationOptions);
        children.push(pagination);
    }

    return h(
        options.type,
        mergeProps({ class: options.class }, options.props),
        children,
    );
}
