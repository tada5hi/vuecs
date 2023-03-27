/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeArrayChildren } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    buildOptionValueOrFail, hasNormalizedSlot, normalizeSlot, unrefWithDefault,
} from '@vue-layout/core';
import { buildListBaseOptions } from '../list-base';
import type { ListHeaderBuildOptions, ListHeaderBuildOptionsInput } from './type';
import { Component, SlotName } from '../constants';
import { buildListTitle } from '../list-title';
import { buildListActionRefresh } from '../list-action-refresh';

export function buildListHeaderOptions(
    input: ListHeaderBuildOptionsInput,
) : ListHeaderBuildOptions {
    const options = buildListBaseOptions(input, Component.ListHeader, {
        class: 'list-header',
    });

    return {
        ...options,

        actionType: buildOptionValueOrFail({
            component: Component.ListHeader,
            key: 'actionType',
            value: unref(options.actionType),
            alt: 'div',
        }),
        actionClass: buildOptionValueOrFail({
            component: Component.ListHeader,
            key: 'actionClass',
            value: unref(options.actionClass),
            alt: [],
        }),
        actionProps: unrefWithDefault(options.actionProps, {}),
        actionRefresh: buildOptionValueOrFail({
            component: Component.ListHeader,
            key: 'actionRefresh',
            value: unref(options.actionRefresh),
            alt: true,
        }),

        title: buildOptionValueOrFail({
            component: Component.ListHeader,
            key: 'title',
            value: unref(options.title),
            alt: true,
        }),

        load: options.load ?? ((() => Promise.resolve())),
        busy: options.busy ?? false,
    };
}

export function buildListHeader(
    input?: ListHeaderBuildOptionsInput,
) : VNode | VNode[] {
    input = input || {};
    const options = buildListHeaderOptions(input);

    const slotScope = {
        busy: options.busy,
        load: options.load,
    };

    if (hasNormalizedSlot(SlotName.HEADER, options.slotItems)) {
        return normalizeSlot(SlotName.HEADER, slotScope, options.slotItems);
    }

    const headerChildren : VNodeArrayChildren = [];

    if (options.title) {
        if (typeof options.title === 'boolean') {
            options.title = {};
        }

        options.title.slotItems = options.slotItems;

        headerChildren.push(buildListTitle(options.title));
    }

    // -------------------------------------------------------------

    if (hasNormalizedSlot(SlotName.HEADER_ACTIONS, options.slotItems)) {
        headerChildren.push(normalizeSlot(
            SlotName.HEADER_ACTIONS,
            {
                load: options.load,
                busy: options.busy,
            },
            options.slotItems,
        ));
    } else {
        const actions : VNodeArrayChildren = [];

        if (options.actionRefresh) {
            actions.push(buildListActionRefresh({
                load: options.load,
                busy: options.busy,
                ...(typeof options.actionRefresh === 'boolean' ? {} : options.actionRefresh),
            }));
        }

        if (actions.length > 0) {
            headerChildren.push(h(
                options.actionType,
                mergeProps({ class: options.actionClass }, options.actionProps),
                actions,
            ));
        }
    }

    // -------------------------------------------------------------

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        headerChildren,
    );
}
