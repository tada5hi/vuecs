/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { createOptionValueBuilder } from '@vue-layout/core';
import { Component } from '../constants';
import { buildListFooter } from '../list-footer';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import { buildListHeader } from '../list-header';
import type { ListItemsBuildOptionsInput } from '../list-items';
import { buildListItems } from '../list-items';
import { buildListLoading } from '../list-loading';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';
import { buildListNoMore } from '../list-no-more';
import { buildListBaseOptions } from '../list-base';
import type { ListBuildOptions, ListBuildOptionsInput } from './type';

export function buildListOptions<T extends Record<string, any>>(
    input: ListBuildOptionsInput<T>,
) : ListBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: 'list',
    });

    const { buildOrFail } = createOptionValueBuilder<ListBuildOptions<T>>(
        Component.List,
    );

    return {
        ...options,

        items: buildOrFail({
            key: 'items',
            value: unref(options.items),
            alt: true,
        }),
        loading: buildOrFail({
            key: 'loading',
            value: unref(options.loading),
            alt: true,
        }),
        noMore: buildOrFail({
            key: 'noMore',
            value: unref(options.noMore),
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
        const childOptions : ListHeaderBuildOptionsInput = typeof options.header === 'boolean' ?
            {} :
            options.header;

        childOptions.slotProps = {
            total: options.total,
            load: options.load,
            busy: options.busy,
        };
        childOptions.slotItems = options.slotItems;

        children.push(buildListHeader(childOptions));
    }

    if (options.items) {
        const childOptions : ListItemsBuildOptionsInput<T> = typeof options.items === 'boolean' ?
            {} :
            options.items;

        childOptions.data = options.data;
        childOptions.busy = options.busy;
        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = options.slotProps;
        childOptions.onDeleted = options.onDeleted;
        childOptions.onUpdated = options.onUpdated;

        children.push(buildListItems(childOptions));
    }

    if (options.loading) {
        const loadingOptions : ListLoadingBuildOptionsInput<T> = typeof options.loading === 'boolean' ?
            {} :
            options.loading;

        loadingOptions.busy = options.busy;
        children.push(buildListLoading(loadingOptions));
    }

    if (options.noMore) {
        const childOptions : ListNoMoreBuildOptionsInput<T> = typeof options.noMore === 'boolean' ?
            {} :
            options.noMore;

        childOptions.busy = options.busy;
        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = options.slotProps;
        childOptions.total = options.total;

        children.push(buildListNoMore(childOptions));
    }

    if (options.footer) {
        const childOptions : ListHeaderBuildOptionsInput = typeof options.footer === 'boolean' ?
            {} :
            options.footer;

        childOptions.slotProps = {
            total: options.total,
            load: options.load,
            busy: options.busy,
        };
        childOptions.slotItems = options.slotItems;

        children.push(buildListFooter(childOptions));
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        children,
    );
}
