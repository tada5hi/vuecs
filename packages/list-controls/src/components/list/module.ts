/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, isRef, mergeProps, unref,
} from 'vue';
import { isPromise } from '@vue-layout/core';
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
import type { ListLoadFn } from '../type';
import type { ListBuildOptions, ListBuildOptionsInput } from './type';

export function buildListOptions<T extends Record<string, any>>(
    input: ListBuildOptionsInput<T>,
) : ListBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItems, {
        class: 'list',
    });

    return {
        ...options,

        busy: options.busy ?? false,

        data: options.data ?? [],

        items: options.items ?? true,
        loading: options.loading ?? true,
        noMore: options.noMore ?? true,
    };
}

export function buildList<T extends Record<string, any>>(
    input: ListBuildOptionsInput<T>,
): VNodeChild {
    const options = buildListOptions(input);

    let load : ListLoadFn | undefined;
    if (options.load) {
        load = (meta) => {
            if (!isRef(options.busy)) {
                return options.load!(meta);
            }

            options.busy.value = true;

            const output = options.load!(meta);
            if (isPromise(output)) {
                return output.finally(() => {
                    if (isRef(options.busy)) {
                        options.busy.value = false;
                    }
                });
            }

            options.busy.value = false;

            return output;
        };
    }
    const children : VNodeArrayChildren = [];

    if (options.header) {
        const childOptions : ListHeaderBuildOptionsInput = typeof options.header === 'boolean' ?
            {} :
            options.header;

        childOptions.slotProps = {
            total: options.total,
            load,
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
            load,
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
