/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, h, unref } from 'vue';
import {
    ComponentListData,
    ComponentListMethods,
    ComponentListProperties,
    ListHeaderBuildOptions,
} from './type';
import { hasNormalizedSlot, normalizeSlot } from '../utils';
import { SlotName } from '../constants';

export function buildListHeader<T extends Record<string, any>>(
    context: ListHeaderBuildOptions<T>,
) : VNode {
    const slotScope = {};

    context = context || {};
    context.iconClass = context.iconClass || 'fa fa-bars';
    context.titleText = context.titleText || 'List';
    context.refreshText = context.refreshText || 'refresh';

    let header = h('');
    if (context.withHeader) {
        const hasHeaderTitleSlot = hasNormalizedSlot(SlotName.HEADER_TITLE, context.$slots);
        const headerTitleAlt = h('h6', {
            class: 'mb-0',
        }, [
            h('i', { class: context.iconClass }),
            ' ',
            context.titleText,
        ]);

        const headerTitle = hasHeaderTitleSlot ?
            normalizeSlot(SlotName.HEADER_TITLE, context.$slots) :
            headerTitleAlt;

        // -------------------------------------------------------------

        const hasHeaderActionsSlot = hasNormalizedSlot(SlotName.HEADER_ACTIONS, context.$slots);
        const headerActionsAlt = h(
            'div',
            {
                class: 'd-flex flex-row',
            },
            [
                h('div', [
                    h('button', {
                        type: 'button',
                        disabled: context.busy,

                        class: 'btn btn-xs btn-dark',
                        onClick($event: any) {
                            $event.preventDefault();

                            return context.load.apply(null);
                        },
                    }, [
                        h('i', { class: 'fa fa-sync' }),
                        ' ',
                        context.refreshText,
                    ]),
                ]),
            ],
        );

        const headerActions = hasHeaderActionsSlot ?
            normalizeSlot(SlotName.HEADER_ACTIONS, {
                load: context.load,
                busy: context.busy,
            }, context.$slots) :
            headerActionsAlt;

        // -------------------------------------------------------------

        const headerAlt = h(
            'div',
            {
                class: 'd-flex flex-row mb-2 align-items-center',
            },
            [
                h('div', [headerTitle]),
                h('div', { class: 'ml-auto' }, [headerActions]),
            ],
        );

        const hasHeaderSlot = hasNormalizedSlot(SlotName.HEADER, context.$slots);
        header = h(
            'div',
            {
                class: 'list-header',
            },
            [hasHeaderSlot ?
                normalizeSlot(SlotName.HEADER, slotScope, context.$slots) :
                headerAlt,
            ],
        );
    }

    return header;
}
