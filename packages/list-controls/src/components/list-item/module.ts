/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import type { VNodeClass } from '@vue-layout/core';
import {
    createOptionBuilder, hasNormalizedSlot,
    hasOwnProperty, normalizeSlot,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions } from '../list-base';
import type {
    ListItemBuildOptions, ListItemBuildOptionsInput, ListItemChildren, ListItemSlotProps,
} from './type';

export function buildListItemOptions<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : ListItemBuildOptions<T> {
    const options = buildListBaseOptions(input, Component.ListItem, {
        class: 'list-item',
        tag: 'li',
    });

    const { buildOrFail } = createOptionBuilder<ListItemBuildOptions<T>>(
        Component.ListItem,
    );

    return {
        ...options,

        icon: buildOrFail({
            key: 'icon',
            value: options.icon,
            alt: true,
        }),
        iconTag: buildOrFail({
            key: 'iconTag',
            value: options.iconTag,
            alt: 'i',
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: options.iconClass,
            alt: [],
        }),
        iconProps: options.iconProps || {},
        iconWrapper: buildOrFail({
            key: 'iconWrapper',
            value: options.iconWrapper,
            alt: true,
        }),
        iconWrapperClass: buildOrFail({
            key: 'iconWrapperClass',
            value: options.iconWrapperClass,
            alt: [],
        }),
        iconWrapperTag: buildOrFail({
            key: 'iconWrapperTag',
            value: options.iconWrapperTag,
            alt: 'div',
        }),

        textFn: options.textFn,
        textPropName: buildOrFail({
            key: 'textPropName',
            value: options.textPropName,
            alt: 'name',
        }),
        textWrapper: buildOrFail({
            key: 'textWrapper',
            value: options.textWrapper,
            alt: true,
        }),
        textWrapperClass: buildOrFail({
            key: 'textWrapperClass',
            value: options.textWrapperClass,
            alt: [],
        }),
        textWrapperTag: buildOrFail({
            key: 'textWrapperTag',
            value: options.textWrapperTag,
            alt: 'div',
        }),

        index: options.index,
        key: options.key,

        data: options.data,

        actions: buildOrFail({
            key: 'actions',
            value: options.actions,
            alt: true,
        }),
        actionsContent: buildOrFail({
            key: 'actionsContent',
            value: options.actionsContent,
            alt: [],
        }),
        actionsWrapper: buildOrFail({
            key: 'actionsWrapper',
            value: options.actionsWrapper,
            alt: true,
        }),
        actionsWrapperClass: buildOrFail({
            key: 'actionsWrapperClass',
            value: options.actionsWrapperClass,
            alt: [],
        }),
        actionsWrapperTag: buildOrFail({
            key: 'actionsWrapperTag',
            value: options.actionsWrapperTag,
            alt: 'div',
        }),
        busy: options.busy ?? false,
    };
}

function maybeWrapContent(input: VNodeChild, ctx: {wrap: boolean, class: VNodeClass, tag: string}) {
    if (!ctx.wrap) {
        return input;
    }

    return h(ctx.tag, { class: ctx.class }, [input]);
}

export function buildListItem<T extends Record<string, any>>(
    input: ListItemBuildOptionsInput<T>,
) : VNodeChild {
    const options = buildListItemOptions(input);

    const data = unref(options.data);
    const slotProps : ListItemSlotProps<T> = {
        data,
        busy: options.busy,
        index: options.index,
        deleted: () => {
            if (options.onDeleted) {
                options.onDeleted(data);
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

    const children : ListItemChildren = {};

    if (hasNormalizedSlot(SlotName.ITEM, options.slotItems)) {
        children.slot = normalizeSlot(SlotName.ITEM, slotProps, options.slotItems);
    } else {
        if (options.icon) {
            children.icon = maybeWrapContent(h(options.iconTag, mergeProps({ class: options.iconClass }, options.iconProps)), {
                wrap: options.iconWrapper,
                tag: options.iconWrapperTag,
                class: options.iconWrapperClass,
            });
        }

        let text : VNodeChild | undefined;

        if (options.textFn) {
            text = options.textFn(data);
        } else if (
            options.textPropName &&
            hasOwnProperty(data, options.textPropName)
        ) {
            text = data[options.textPropName];
        }

        if (text) {
            children.text = maybeWrapContent(text, {
                wrap: options.textWrapper,
                tag: options.textWrapperTag,
                class: options.textWrapperClass,
            });
        }

        let actions : VNodeChild | undefined;
        if (options.actions) {
            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, options.slotItems)) {
                actions = [
                    normalizeSlot(SlotName.ITEM_ACTIONS, slotProps, options.slotItems),
                ];
            } else if (options.actionsContent) {
                actions = options.actionsContent;
            }

            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS_EXTRA, options.slotItems)) {
                actions = [
                    actions,
                    normalizeSlot(SlotName.ITEM_ACTIONS_EXTRA, slotProps, options.slotItems),
                ];
            }
        }

        if (actions) {
            children.actions = maybeWrapContent(actions, {
                wrap: options.actionsWrapper,
                tag: options.actionsWrapperTag,
                class: options.actionsWrapperClass,
            });
        }
    }

    if (typeof options.fn === 'function') {
        return renderContent(options.fn(
            data,
            slotProps,
            children,
        ));
    }

    const content = [
        ...(children.icon ? [children.icon] : []),
        ...(children.text ? [children.text] : []),
        ...(children.actions ? [children.actions] : []),
    ];

    return renderContent(content);
}
