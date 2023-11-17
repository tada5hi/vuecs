/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import {
    h, mergeProps, unref,
} from 'vue';
import type { VNodeClass } from '@vue-layout/core';
import {
    createOptionBuilder,
    evaluateFnOrValue,
    hasNormalizedSlot,
    hasOwnProperty, isObject,
    merge,
    normalizeSlot,
    setMaybeRefValue,
} from '@vue-layout/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListEventFn } from '../type';
import type {
    ListItemBuildOptions, ListItemBuildOptionsInput, ListItemChildren, ListItemSlotProps,
} from './type';

export function buildListItemOptions<T, M = any>(
    input: ListItemBuildOptionsInput<T, M>,
) : ListItemBuildOptions<T, M> {
    const options = buildListBaseOptions(input, Component.ListItem, {
        class: 'list-item',
        tag: 'li',
    });

    const { buildOrFail } = createOptionBuilder<ListItemBuildOptions<T>>(
        Component.ListItem,
    );

    return {
        ...options,

        data: input.data,
        content: input.content,
        index: input.index,

        icon: buildOrFail({
            key: 'icon',
            value: input.icon,
            alt: true,
        }),
        iconTag: buildOrFail({
            key: 'iconTag',
            value: input.iconTag,
            alt: 'i',
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: input.iconClass,
            alt: [],
        }),
        iconProps: input.iconProps || {},
        iconWrapper: buildOrFail({
            key: 'iconWrapper',
            value: input.iconWrapper,
            alt: true,
        }),
        iconWrapperClass: buildOrFail({
            key: 'iconWrapperClass',
            value: input.iconWrapperClass,
            alt: [],
        }),
        iconWrapperTag: buildOrFail({
            key: 'iconWrapperTag',
            value: input.iconWrapperTag,
            alt: 'div',
        }),

        text: buildOrFail({
            key: 'text',
            value: input.text,
            alt: true,
        }),
        textContent: input.textContent,
        textPropName: buildOrFail({
            key: 'textPropName',
            value: input.textPropName,
            alt: 'name',
        }),
        textWrapper: buildOrFail({
            key: 'textWrapper',
            value: input.textWrapper,
            alt: true,
        }),
        textWrapperClass: buildOrFail({
            key: 'textWrapperClass',
            value: input.textWrapperClass,
            alt: [],
        }),
        textWrapperTag: buildOrFail({
            key: 'textWrapperTag',
            value: input.textWrapperTag,
            alt: 'div',
        }),

        actions: buildOrFail({
            key: 'actions',
            value: input.actions,
            alt: true,
        }),
        actionsContent: buildOrFail({
            key: 'actionsContent',
            value: input.actionsContent,
            alt: [],
        }),
        actionsWrapper: buildOrFail({
            key: 'actionsWrapper',
            value: input.actionsWrapper,
            alt: true,
        }),
        actionsWrapperClass: buildOrFail({
            key: 'actionsWrapperClass',
            value: input.actionsWrapperClass,
            alt: [],
        }),
        actionsWrapperTag: buildOrFail({
            key: 'actionsWrapperTag',
            value: input.actionsWrapperTag,
            alt: 'div',
        }),
    };
}

function maybeWrapContent(input: VNodeChild, ctx: {wrap: boolean, class: VNodeClass, tag: string}) {
    if (!ctx.wrap) {
        return input;
    }

    return h(ctx.tag, { class: ctx.class }, [input]);
}

export function buildListItem<T, M = any>(
    input: ListItemBuildOptionsInput<T, M>,
) : VNodeChild {
    const options = buildListItemOptions(input);

    const data = unref(options.data);

    const overrideUpdatedFn = (fn: ListEventFn<T>, item?: T) : ListEventFn<T | undefined> => {
        if (
            isObject(item) &&
            isObject(data)
        ) {
            options.data = setMaybeRefValue(options.data, merge(item || {}, data) as T);
        } else if (item) {
            options.data = setMaybeRefValue(options.data, item);
        }

        return fn(unref(options.data));
    };

    let slotProps : ListItemSlotProps<T>;
    if (options.slotPropsBuilt) {
        const {
            updated,
            deleted,
            ...original
        } = options.slotProps;

        slotProps = {
            ...original,
            data,
            index: options.index,
        };

        if (updated) {
            slotProps.updated = (item?: T) => overrideUpdatedFn(updated, item);
        }

        if (deleted) {
            slotProps.deleted = (item?: T) => deleted(item || data);
        }
    } else {
        const {
            updated,
            deleted,
            ...original
        } = buildListBaseSlotProps<T, M>({
            ...options,
            data: options.data,
        });

        slotProps = {
            ...original,
            data,
            index: options.index,
        };

        if (updated) {
            slotProps.updated = (item?: T) => overrideUpdatedFn(updated, item);
        }

        if (deleted) {
            slotProps.deleted = (item?: T) => deleted(item || data);
        }
    }

    const renderContent = (content?: VNodeChild) : VNodeChild => h(
        options.tag,
        mergeProps({ key: options.index }, { class: options.class }, options.props),
        [content || []],
    );

    const children : ListItemChildren = {};

    if (hasNormalizedSlot(SlotName.ITEM, options.slotItems)) {
        children.slot = normalizeSlot(SlotName.ITEM, slotProps, options.slotItems);
    } else {
        if (options.icon) {
            children.icon = maybeWrapContent(
                h(options.iconTag, mergeProps({ class: options.iconClass }, options.iconProps)),
                {
                    wrap: options.iconWrapper,
                    tag: options.iconWrapperTag,
                    class: options.iconWrapperClass,
                },
            );
        }

        if (options.text) {
            let text: VNodeChild | undefined;

            if (options.textContent) {
                text = evaluateFnOrValue(options.textContent, data, slotProps);
            } else if (
                options.textPropName &&
                isObject(data) &&
                hasOwnProperty(data, options.textPropName)
            ) {
                text = data[options.textPropName] as VNodeChild;
            }

            if (text) {
                children.text = maybeWrapContent(text, {
                    wrap: options.textWrapper,
                    tag: options.textWrapperTag,
                    class: options.textWrapperClass,
                });
            }
        }

        let actions : VNodeChild | undefined;
        if (options.actions) {
            if (hasNormalizedSlot(SlotName.ITEM_ACTIONS, options.slotItems)) {
                actions = [
                    normalizeSlot(SlotName.ITEM_ACTIONS, slotProps, options.slotItems),
                ];
            } else if (options.actionsContent) {
                actions = evaluateFnOrValue(options.actionsContent, data, slotProps);
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

    if (options.content) {
        return renderContent(evaluateFnOrValue(options.content, data, slotProps, children));
    }

    if (children.slot) {
        return renderContent(children.slot);
    }

    const content = [
        ...(children.icon ? [children.icon] : []),
        ...(children.text ? [children.text] : []),
        ...(children.actions ? [children.actions] : []),
    ];

    return renderContent(content);
}
