/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { createOptionBuilder } from '@vue-layout/core';
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

    const { buildOrFail } = createOptionBuilder<ListBuildOptions<T>>(
        Component.List,
    );

    return {
        ...options,

        busy: buildOrFail({
            key: 'busy',
            value: options.busy,
            alt: false,
        }),

        data: buildOrFail({
            key: 'data',
            value: options.data,
            alt: [],
        }),

        items: buildOrFail({
            key: 'items',
            value: options.items,
            alt: true,
        }),
        loading: buildOrFail({
            key: 'loading',
            value: options.loading,
            alt: true,
        }),
        noMore: buildOrFail({
            key: 'noMore',
            value: options.noMore,
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

    const busy = unref(options.busy);

    if (options.items) {
        let childOptions : ListItemsBuildOptionsInput<T>;
        if (typeof options.items === 'boolean') {
            childOptions = {
                data: options.data,
                busy,
            };
        } else {
            childOptions = options.items;
            childOptions.data = options.data;
            childOptions.busy = busy;
        }

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = options.slotProps;
        childOptions.onDeleted = options.onDeleted;
        childOptions.onUpdated = options.onUpdated;

        children.push(buildListItems(childOptions));
    }

    if (options.loading) {
        let loadingOptions : ListLoadingBuildOptionsInput<T>;
        if (typeof options.loading === 'boolean') {
            loadingOptions = {};
        } else {
            loadingOptions = options.loading;
        }

        loadingOptions.busy = busy;
        children.push(buildListLoading(loadingOptions));
    }

    if (options.noMore) {
        const childOptions : ListNoMoreBuildOptionsInput<T> = typeof options.noMore === 'boolean' ?
            {} :
            options.noMore;

        childOptions.busy = busy;
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
            busy,
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
