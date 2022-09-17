/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h, mergeProps, unref,
} from 'vue';
import { ListTitleBuildOptions, ListTitleBuildOptionsInput } from './type';
import { buildListBaseOptions, hasNormalizedSlot, normalizeSlot } from '../utils';
import { SlotName } from '../constants';
import { Component, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';

export function buildListTitleOptions(
    input: ListTitleBuildOptionsInput,
) : ListTitleBuildOptions {
    const options = buildListBaseOptions(input, Component.ListTitle, {
        class: {
            alt: [],
        },
    });

    return {
        ...options,

        text: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'text',
            value: unref(options.text),
            alt: true,
        }),
        textClass: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'textClass',
            value: unref(options.textClass),
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'mb-0',
                },
                [Library.BOOTSTRAP_V5]: {
                    value: 'mb-0',
                },
            },
        }),
        textType: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'textType',
            value: unref(options.textType),
            alt: 'h4',
        }),
        textProps: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'textProps',
            value: unref(options.textProps),
            alt: {},
        }),
        textContent: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'textContent',
            value: unref(options.textContent),
            alt: 'List',
        }),

        icon: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'icon',
            value: unref(options.icon),
            alt: true,
        }),
        iconClass: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'iconClass',
            value: unref(options.iconClass),
            alt: [],
            library: {
                [Library.FONT_AWESOME]: {
                    value: 'fa fa-bars',
                },
            },
        }),
        iconProps: buildOptionValueOrFail({
            component: Component.ListTitle,
            key: 'iconProps',
            value: unref(options.iconProps),
            alt: {},
        }),
    };
}

export function buildListTitle(
    input: ListTitleBuildOptionsInput,
) : VNode | VNode[] {
    const options = buildListTitleOptions(input);

    if (hasNormalizedSlot(SlotName.HEADER_TITLE, options.slotItems)) {
        return normalizeSlot(SlotName.HEADER_TITLE, options.slotItems);
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

    return h(options.type, mergeProps({ class: options.class }, options.props), children);
}
