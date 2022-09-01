/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, VNodeChild, h, mergeProps, unref,
} from 'vue';
import { buildListBaseOptions, hasNormalizedSlot, normalizeSlot } from '../utils';
import { SlotName } from '../constants';
import { ListItemBuildOptions, ListItemBuildOptionsInput } from './type';
import { hasOwnProperty, unrefWithDefault } from '../../utils';
import { Component, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';

export function buildListItemOptions<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : ListItemBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItem, {
        class: {
            alt: 'list-item',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'd-flex flex-row align-items-center',
                },
            },
        },
    });

    return {
        ...options,

        icon: buildOptionValueOrFail({
            component: Component.ListItem,
            key: 'icon',
            value: unref(options.icon),
            alt: true,
        }),
        iconClass: buildOptionValueOrFail({
            component: Component.ListItem,
            key: 'iconClass',
            value: unref(options.iconClass),
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'pr-1',
                },
                [Library.FONT_AWESOME]: {
                    value: 'fa fa-bars',
                },
            },
        }),
        iconProps: unrefWithDefault(options.iconProps, {}),

        textPropName: buildOptionValueOrFail({
            component: Component.ListItem,
            key: 'textPropName',
            value: unref(options.textPropName),
            alt: 'name',
        }),

        index: unref(options.index),
        key: unref(options.key),

        data: unref(options.data),

        actions: buildOptionValueOrFail({
            component: Component.ListItem,
            key: 'actions',
            value: unref(options.actions),
            alt: [],
        }),
        busy: unrefWithDefault(options.busy, false),

    };
}

export function buildListItem<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : VNode | VNode[] {
    const options = buildListItemOptions(input);

    const slotProps = {
        itemBusy: options.busy,
        item: options.data,
        busy: options.busy,
        index: options.index,
        ...(options.slotProps || {}),
    };

    if (hasNormalizedSlot(SlotName.ITEM, options.slotItems)) {
        return normalizeSlot(SlotName.ITEM, slotProps, options.slotItems);
    }

    // todo: maybe wrap item :)
    if (typeof options.fn === 'function') {
        return options.fn(options.data, options.index);
    }

    const children : VNodeArrayChildren = [];
    if (options.icon) {
        // class: pr-1
        children.push(h('div', [h('i', mergeProps({ class: options.iconClass }, options.iconProps))]));
    }

    let itemText : string | VNode | undefined | (string | VNode)[];
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
        children.push(h('div', { class: 'ml-auto' }, actions));
    }

    return h(options.type, mergeProps({ key: options.index }, { class: options.class }, options.props), children);
}
