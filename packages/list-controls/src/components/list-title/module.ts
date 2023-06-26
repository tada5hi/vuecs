/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import {
    createOptionBuilder, hasNormalizedSlot, normalizeSlot,
} from '@vue-layout/core';
import { buildListBaseOptions } from '../list-base';
import type { ListTitleBuildOptions, ListTitleBuildOptionsInput } from './type';
import { Component, SlotName } from '../constants';

export function buildListTitleOptions(
    input: ListTitleBuildOptionsInput,
) : ListTitleBuildOptions {
    const options = buildListBaseOptions(input, Component.ListTitle, {
        class: 'list-title',
    });

    const { buildOrFail } = createOptionBuilder<ListTitleBuildOptions>(
        Component.ListTitle,
    );

    return {
        ...options,

        text: buildOrFail({
            key: 'text',
            value: options.text,
            alt: true,
        }),
        textClass: buildOrFail({
            key: 'textClass',
            value: options.textClass,
            alt: [],
        }),
        textType: buildOrFail({
            key: 'textType',
            value: options.textType,
            alt: 'h4',
        }),
        textProps: buildOrFail({
            key: 'textProps',
            value: options.textProps,
            alt: {},
        }),
        textContent: buildOrFail({
            key: 'textContent',
            value: options.textContent,
            alt: 'List',
        }),

        icon: buildOrFail({
            key: 'icon',
            value: options.icon,
            alt: true,
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: options.iconClass,
            alt: [],
        }),
        iconProps: buildOrFail({
            key: 'iconProps',
            value: options.iconProps,
            alt: {},
        }),
    };
}

export function buildListTitle(
    input: ListTitleBuildOptionsInput,
) : VNodeChild {
    const options = buildListTitleOptions(input);

    const renderContent = (content: VNode | VNodeArrayChildren) => h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        content,
    );

    if (hasNormalizedSlot(SlotName.HEADER_TITLE, options.slotItems)) {
        return renderContent(normalizeSlot(SlotName.HEADER_TITLE, options.slotItems));
    }

    let children: VNodeArrayChildren = [];
    if (options.icon) {
        children.push(h('i', mergeProps({ class: options.iconClass }, options.iconProps)));
    }

    if (options.text) {
        if (
            options.icon &&
            typeof options.textContent === 'string'
        ) {
            children.push(' ');
        }

        children = [h(options.textType, mergeProps({ class: options.textClass }, options.textProps), [...children, options.textContent])];
    }

    return renderContent(children);
}
