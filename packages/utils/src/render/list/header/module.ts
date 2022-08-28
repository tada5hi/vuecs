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
    ListHeaderBuildOptions, ListHeaderBuildOptionsInput,
} from './type';
import { hasNormalizedSlot, normalizeSlot } from '../../utils';
import { SlotName } from '../../constants';
import { unrefWithDefault } from '../../../utils';
import { buildListTitle } from '../title/module';
import { buildListActionRefresh } from '../action-refresh/module';
import { buildListBaseOptions } from '../utils';

export function buildListHeaderOptions<T extends Record<string, any>>(
    input: ListHeaderBuildOptionsInput<T>,
) : ListHeaderBuildOptions<T> {
    const options = buildListBaseOptions(input, {
        props: {
            class: 'list-header d-flex flex-row mb-2 align-items-center',
        },
    });

    return {
        ...options,

        actionType: unrefWithDefault(options.actionType, 'div'),
        actionProps: unrefWithDefault(options.actionProps, {
            class: 'd-flex flex-row ml-auto',
        }),
        actionRefresh: unrefWithDefault(options.actionRefresh, true),

        title: unrefWithDefault(options.title, true),

        load: unrefWithDefault(options.load, () => Promise.resolve()),
        busy: unrefWithDefault(options.busy, false),
    };
}

export function buildListHeader<T extends Record<string, any>>(
    input?: ListHeaderBuildOptionsInput<T>,
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
            if (typeof options.actionRefresh === 'boolean') {
                options.actionRefresh = {
                    load: options.load,
                    busy: options.busy,
                };
            }

            actions.push(buildListActionRefresh(options.actionRefresh));
        }

        if (actions.length > 0) {
            headerChildren.push(h(
                options.actionType,
                options.actionProps,
                actions,
            ));
        }
    }

    // -------------------------------------------------------------

    return h(
        options.type,
        options.props,
        headerChildren,
    );
}
