/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    createComponentOptionBuilder, extractValueFromOptionValueInput, hasNormalizedSlot,
    hasOwnProperty, normalizeSlot, unrefWithDefault,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type { ListItemBuildOptions, ListItemBuildOptionsInput, ListItemSlotProps } from './type';

export function buildListItemOptions<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : ListItemBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItem, {
        class: 'list-item',
        tag: 'li',
    });

    const { buildOrFail } = createComponentOptionBuilder<ListItemBuildOptions<T>>(
        Component.ListItem,
    );

    return {
        ...options,

        icon: buildOrFail({
            key: 'icon',
            value: unref(options.icon),
            alt: true,
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: unref(options.iconClass),
            alt: [],
        }),
        iconProps: unrefWithDefault(options.iconProps, {}),

        textFn: options.textFn,
        textPropName: buildOrFail({
            key: 'textPropName',
            value: unref(options.textPropName),
            alt: 'name',
        }),

        index: unref(extractValueFromOptionValueInput(options.index)),
        key: unref(extractValueFromOptionValueInput(options.key)),

        data: unref(extractValueFromOptionValueInput(options.data)),

        actions: buildOrFail({
            key: 'actions',
            value: unref(options.actions),
            alt: [],
        }),
        busy: unrefWithDefault(extractValueFromOptionValueInput(options.busy), false),
    };
}

export function buildListItem<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : VNode | VNode[] {
    const options = buildListItemOptions(input);

    const slotProps : ListItemSlotProps<T> = {
        data: options.data,
        busy: options.busy,
        index: options.index,
        deleted: () => {
            if (options.onDeleted) {
                options.onDeleted(options.data);
            }
        },
        updated: (item: T) => {
            if (options.onUpdated) {
                options.onUpdated(item);
            }
        },
        ...(options.slotProps || {}),
    };

    const renderContent = (content?: VNodeChild) => h(
        options.tag,
        mergeProps({ key: options.index }, { class: options.class }, options.props),
        [content || []],
    );

    let content : VNodeChild | undefined;

    if (hasNormalizedSlot(SlotName.ITEM, options.slotItems)) {
        content = normalizeSlot(SlotName.ITEM, slotProps, options.slotItems);
    } else {
        const children : VNodeChild = [];
        if (options.icon) {
            children.push(h('div', [h('i', mergeProps({ class: options.iconClass }, options.iconProps))]));
        }

        let itemText : VNodeChild | undefined;

        if (options.textFn) {
            itemText = options.textFn(options.data);
        } else if (hasOwnProperty(options.data, options.textPropName)) {
            itemText = options.data[options.textPropName];
        }

        if (itemText) {
            children.push(itemText);
        }

        let actions : VNodeChild[] = [];
        if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, options.slotItems)) {
            actions = [
                normalizeSlot(SlotName.ITEM_ACTIONS, slotProps, options.slotItems),
            ];
        } else if (options.actions) {
            actions = [
                ...(Array.isArray(options.actions) ? options.actions : [options.actions]) as VNode[],
            ];

            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS_EXTRA, options.slotItems)) {
                actions.push(normalizeSlot(SlotName.ITEM_ACTIONS_EXTRA, slotProps, options.slotItems));
            }
        }
        if (
            actions &&
            actions.length > 0
        ) {
            // todo: make VNode-class an option
            children.push(h('div', { class: 'ms-auto ml-auto' }, actions));
        }

        if (children.length > 0) {
            content = children;
        }
    }

    if (typeof options.fn === 'function') {
        return renderContent(options.fn(
            options.data,
            slotProps,
            content,
        ));
    }

    return renderContent(content);
}
