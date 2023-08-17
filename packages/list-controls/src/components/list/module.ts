/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, mergeProps, unref,
} from 'vue';
import { Component, SlotName } from '../constants';
import type { ListFooterBuildOptionsInput } from '../list-footer';
import { buildListFooter } from '../list-footer';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import { buildListHeader } from '../list-header';
import type { ListBodyBuildOptionsInput } from '../list-body';
import { buildListBody } from '../list-body';
import { buildListLoading } from '../list-loading';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';
import { buildListNoMore } from '../list-no-more';
import type { ListBaseSlotProps } from '../list-base';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListBuildOptions, ListBuildOptionsInput, ListSlotProps } from './type';

export function buildListOptions<T>(
    input: ListBuildOptionsInput<T>,
) : ListBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.List, {
        class: 'list',
    });

    return {
        ...options,

        data: input.data ?? [],

        header: input.header ?? true,
        footer: input.footer ?? true,
        body: input.body ?? true,
        loading: input.loading ?? true,
        noMore: input.noMore ?? true,
    };
}

export function buildList<T>(
    input: ListBuildOptionsInput<T>,
): VNodeChild {
    const options = buildListOptions(input);
    if (typeof options.meta.total === 'undefined') {
        options.meta.total = unref(options.data).length;
    }

    const busy = unref(options.busy);

    const buildSlotProps = (props: Record<string, any>) : Record<string, any> & ListBaseSlotProps<T> => ({
        ...props,
        ...buildListBaseSlotProps(options),
    });

    if (hasNormalizedSlot(SlotName.DEFAULT, options.slotItems)) {
        const slotProps : ListSlotProps<T> = {
            ...buildSlotProps(options.slotProps),
            data: unref(options.data),
        };

        return normalizeSlot(SlotName.DEFAULT, slotProps, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    if (options.header) {
        const childOptions : ListHeaderBuildOptionsInput<T> = typeof options.header === 'boolean' ?
            {} :
            options.header;

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = buildSlotProps(options.slotProps);
        childOptions.slotPropsBuilt = true;

        childOptions.meta = options.meta;

        children.push(buildListHeader(childOptions));
    }

    if (options.body) {
        let childOptions : ListBodyBuildOptionsInput<T>;
        if (typeof options.body === 'boolean') {
            childOptions = {
                data: options.data,
                busy,
            };
        } else {
            childOptions = options.body;
            childOptions.data = options.data;
            childOptions.busy = busy;
        }

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = buildSlotProps(options.slotProps);
        childOptions.slotPropsBuilt = true;

        childOptions.meta = options.meta;

        children.push(buildListBody(childOptions));
    }

    if (options.loading) {
        let childOptions : ListLoadingBuildOptionsInput<T>;
        if (typeof options.loading === 'boolean') {
            childOptions = {};
        } else {
            childOptions = options.loading;
        }

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = buildSlotProps(options.slotProps);
        childOptions.slotPropsBuilt = true;

        childOptions.meta = options.meta;
        childOptions.busy = busy;

        children.push(buildListLoading(childOptions));
    }

    if (options.noMore) {
        const childOptions : ListNoMoreBuildOptionsInput<T> = typeof options.noMore === 'boolean' ?
            {} :
            options.noMore;

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = buildSlotProps(options.slotProps);
        childOptions.slotPropsBuilt = true;

        childOptions.meta = options.meta;
        childOptions.busy = busy;

        children.push(buildListNoMore(childOptions));
    }

    if (options.footer) {
        const childOptions : ListFooterBuildOptionsInput<T> = typeof options.footer === 'boolean' ?
            {} :
            options.footer;

        childOptions.slotItems = options.slotItems;
        childOptions.slotProps = buildSlotProps(options.slotProps);
        childOptions.slotPropsBuilt = true;

        childOptions.meta = options.meta;

        children.push(buildListFooter(childOptions));
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        children,
    );
}
