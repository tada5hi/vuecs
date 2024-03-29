import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import {
    h, mergeProps, unref,
} from 'vue';
import { boolableToObject } from '../../utils';
import { Component, SlotName } from '../constants';
import { buildListFooter } from '../list-footer';
import { buildListHeader } from '../list-header';
import type { ListBodyBuildOptionsInput } from '../list-body';
import { buildListBody } from '../list-body';
import { buildListLoading } from '../list-loading';
import { buildListNoMore } from '../list-no-more';
import type { ListBaseOptionsInput, ListBaseSlotProps } from '../list-base';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListBuildOptions, ListBuildOptionsInput, ListSlotProps } from './type';

export function buildListOptions<T, M = any>(
    input: ListBuildOptionsInput<T, M>,
) : ListBuildOptions<T, M> {
    const options = buildListBaseOptions(input, Component.List, {
        class: 'list',
    });

    return {
        ...options,

        data: input.data ?? [],

        header: input.header ?? true,
        footer: input.footer ?? true,
        body: input.body ?? true,
        loading: input.loading ?? true,
        noMore: input.noMore ?? true,
    };
}

export function buildList<T, M = any>(
    input: ListBuildOptionsInput<T, M>,
): VNodeChild {
    const options = buildListOptions(input);

    if (typeof options.total === 'undefined') {
        options.total = unref(options.data).length;
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
