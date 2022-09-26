/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h, mergeProps, unref,
} from 'vue';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import { buildListBaseOptions } from '../list-base';
import { ListTitleBuildOptions, ListTitleBuildOptionsInput } from './type';
import { Component, SlotName } from '../constants';
import { createOptionValueBuilder } from '../../options';
import { Preset } from '../../constants';

export function buildListTitleOptions(
    input: ListTitleBuildOptionsInput,
) : ListTitleBuildOptions {
    const options = buildListBaseOptions(input, Component.ListTitle, {
        class: {
            alt: [],
        },
    });

    const { buildOrFail } = createOptionValueBuilder<ListTitleBuildOptions>(
        Component.ListTitle,
    );

    return {
        ...options,

        text: buildOrFail({
            key: 'text',
            value: unref(options.text),
            alt: true,
        }),
        textClass: buildOrFail({
            key: 'textClass',
            value: unref(options.textClass),
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'mb-0',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'mb-0',
                },
            },
        }),
        textType: buildOrFail({
            key: 'textType',
            value: unref(options.textType),
            alt: 'h4',
        }),
        textProps: buildOrFail({
            key: 'textProps',
            value: unref(options.textProps),
            alt: {},
        }),
        textContent: buildOrFail({
            key: 'textContent',
            value: unref(options.textContent),
            alt: 'List',
        }),

        icon: buildOrFail({
            key: 'icon',
            value: unref(options.icon),
            alt: true,
        }),
        iconClass: buildOrFail({
            key: 'iconClass',
            value: unref(options.iconClass),
            alt: [],
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-bars',
                },
            },
        }),
        iconProps: buildOrFail({
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

    return h(options.tag, mergeProps({ class: options.class }, options.props), children);
}
