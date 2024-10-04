/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { boolableToObject } from '../../utils';
import { SlotName } from '../constants';
import type { ListBaseOptionsInput, ListBaseSlotProps } from '../list-base';
import { buildListBaseSlotProps } from '../list-base';
import type { ListBodyBuildOptionsInput } from '../list-body';
import { buildListBody } from '../list-body';
import { buildListFooter } from '../list-footer';
import { buildListHeader } from '../list-header';
import { buildListLoading } from '../list-loading';
import { buildListNoMore } from '../list-no-more';
import { normalizeListOptions } from './normalize';
import type { ListBuildOptionsInput, ListSlotProps } from './types';

export function buildList<T, M = any>(
    input: ListBuildOptionsInput<T, M>,
): VNodeChild {
    const options = normalizeListOptions(input);

    if (typeof options.total === 'undefined') {
        options.total = options.data.length;
    }

    const buildSlotProps = (props: Record<string, any>) : Record<string, any> & ListBaseSlotProps<T> => ({
        ...props,
        ...buildListBaseSlotProps(options),
    });

    const extendChildOptions = <F extends ListBaseOptionsInput<T, M>>(input: F) => {
        input.slotItems = options.slotItems;
        input.slotProps = buildSlotProps(options.slotProps);
        input.slotPropsBuilt = true;

        input.busy = options.busy;
        input.meta = options.meta;
        input.total = options.total;

        return input;
    };

    if (hasNormalizedSlot(SlotName.DEFAULT, options.slotItems)) {
        const slotProps : ListSlotProps<T, M> = {
            ...buildSlotProps(options.slotProps),
            data: unref(options.data),
        };

        return normalizeSlot(SlotName.DEFAULT, slotProps, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    if (options.header) {
        children.push(
            buildListHeader(
                extendChildOptions(
                    boolableToObject(options.header),
                ),
            ),
        );
    }

    if (options.body) {
        let childOptions : ListBodyBuildOptionsInput<T, M>;
        if (typeof options.body === 'boolean') {
            childOptions = {
                data: options.data,
                busy: options.busy,
            };
        } else {
            childOptions = options.body;
            childOptions.data = options.data;
            childOptions.busy = options.busy;
        }

        children.push(buildListBody(extendChildOptions(childOptions)));
    }

    if (options.loading) {
        children.push(
            buildListLoading(
                extendChildOptions(
                    boolableToObject(options.loading),
                ),
            ),
        );
    }

    if (options.noMore) {
        children.push(
            buildListNoMore(
                extendChildOptions(
                    boolableToObject(options.noMore),
                ),
            ),
        );
    }

    if (options.footer) {
        children.push(
            buildListFooter(
                extendChildOptions(
                    boolableToObject(options.footer),
                ),
            ),
        );
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        children,
    );
}
