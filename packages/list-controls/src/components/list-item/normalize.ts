/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { createComponentOptionsManager } from '@vuecs/core';
import { Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListItemBuildOptions, ListItemBuildOptionsInput } from './type';

export function normalizeListItemOptions<T, M = any>(
    input: ListItemBuildOptionsInput<T, M>,
): ListItemBuildOptions<T, M> {
    const options = normalizeListBaseOptions(input, Component.ListItem, {
        class: 'list-item',
        tag: 'li',
    });

    const manager = createComponentOptionsManager<ListItemBuildOptions<T>>({
        name: Component.ListItem,
    });

    return {
        ...options,

        data: input.data,
        content: input.content,
        index: input.index,

        icon: manager.buildOrFail({
            key: 'icon',
            value: input.icon,
            alt: true,
        }),
        iconTag: manager.buildOrFail({
            key: 'iconTag',
            value: input.iconTag,
            alt: 'i',
        }),
        iconClass: manager.buildOrFail({
            key: 'iconClass',
            value: input.iconClass,
            alt: [],
        }),
        iconProps: input.iconProps || {},
        iconWrapper: manager.buildOrFail({
            key: 'iconWrapper',
            value: input.iconWrapper,
            alt: true,
        }),
        iconWrapperClass: manager.buildOrFail({
            key: 'iconWrapperClass',
            value: input.iconWrapperClass,
            alt: [],
        }),
        iconWrapperTag: manager.buildOrFail({
            key: 'iconWrapperTag',
            value: input.iconWrapperTag,
            alt: 'div',
        }),

        text: manager.buildOrFail({
            key: 'text',
            value: input.text,
            alt: true,
        }),
        textContent: input.textContent,
        textPropName: manager.buildOrFail({
            key: 'textPropName',
            value: input.textPropName,
            alt: 'name',
        }),
        textWrapper: manager.buildOrFail({
            key: 'textWrapper',
            value: input.textWrapper,
            alt: true,
        }),
        textWrapperClass: manager.buildOrFail({
            key: 'textWrapperClass',
            value: input.textWrapperClass,
            alt: [],
        }),
        textWrapperTag: manager.buildOrFail({
            key: 'textWrapperTag',
            value: input.textWrapperTag,
            alt: 'div',
        }),

        actions: manager.buildOrFail({
            key: 'actions',
            value: input.actions,
            alt: true,
        }),
        actionsContent: manager.buildOrFail({
            key: 'actionsContent',
            value: input.actionsContent,
            alt: [],
        }),
        actionsWrapper: manager.buildOrFail({
            key: 'actionsWrapper',
            value: input.actionsWrapper,
            alt: true,
        }),
        actionsWrapperClass: manager.buildOrFail({
            key: 'actionsWrapperClass',
            value: input.actionsWrapperClass,
            alt: [],
        }),
        actionsWrapperTag: manager.buildOrFail({
            key: 'actionsWrapperTag',
            value: input.actionsWrapperTag,
            alt: 'div',
        }),
    };
}
