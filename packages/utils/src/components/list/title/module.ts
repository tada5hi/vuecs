/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h,
} from 'vue';
import {
    ListTitleBuildOptions,
    ListTitleBuildOptionsInput,
} from './type';
import { unrefWithDefault } from '../../../utils';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import { SlotName } from '../../constants';
import { buildListBaseOptions } from '../utils';

export function buildListTitleOptions<T extends Record<string, any>>(
    input: ListTitleBuildOptionsInput<T>,
) : ListTitleBuildOptions<T> {
    const options = buildListBaseOptions(input, {
        type: 'h6',
    });

    return {
        ...options,

        text: unrefWithDefault(options.text, true),
        textProps: unrefWithDefault(options.textProps, {
            class: 'mb-0',
        }),
        textContent: unrefWithDefault(options.textContent, 'List'),

        icon: unrefWithDefault(options.icon, true),
        iconProps: unrefWithDefault(options.iconProps, {
            class: 'fa fa-bars',
        }),
    };
}

export function buildListTitle<T extends Record<string, any>>(
    input: ListTitleBuildOptionsInput<T>,
) : VNode | VNode[] {
    const options = buildListTitleOptions(input);

    if (hasNormalizedSlot(SlotName.HEADER_TITLE, options.slotItems)) {
        return normalizeSlot(SlotName.HEADER_TITLE, options.slotItems);
    }
    const children: VNodeArrayChildren = [];
    if (options.icon) {
        children.push(h('i', options.iconProps));
    }

    if (options.text) {
        if (
            options.icon &&
            typeof options.textContent === 'string'
        ) {
            children.push(' ');
        }

        children.push(options.textContent);
    }

    return h(options.type, options.textProps, children);
}
