import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    createComponentOptionsManager,
    hasNormalizedSlot, hasOwnProperty,
    isObject,
    normalizeSlot,
} from '@vuecs/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListNoMoreBuildOptions, ListNoMoreBuildOptionsInput, ListNoMoreSlotProps } from './type';

export function buildListNoMoreOptions<T, M = any>(
    input: ListNoMoreBuildOptionsInput<T, M>,
) : ListNoMoreBuildOptions<T, M> {
    const options = buildListBaseOptions(input, Component.ListNoMore, {
        class: 'list-no-more',
    });

    const manager = createComponentOptionsManager<ListNoMoreBuildOptions<T>>({
        name: Component.ListNoMore,
    });

    return {
        ...options,

        content: manager.buildOrFail({
            key: 'content',
            value: input.content,
            alt: 'No more items available...',
        }),
    };
}

export function buildListNoMore<T, M = any>(
    input?: ListNoMoreBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};

    const options = buildListNoMoreOptions(input);

    const busy = unref(options.busy);
    const total = unref(options.total);

    if (busy) {
        return [];
    }

    if (typeof total === 'number') {
        if (total > 0) {
            return [];
        }
    } else if (
        isObject(options.meta) &&
        hasOwnProperty(options.meta, 'total') &&
        typeof options.meta.total === 'number' &&
        options.meta.total > 0
    ) {
        return [];
    }

    let slotProps : ListNoMoreSlotProps<T>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T>(options),
            ...options.slotProps,
        };
    }

    const renderContent = (content?: VNodeChild) : VNodeChild => h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        [content],
    );

    if (hasNormalizedSlot(SlotName.NO_MORE, options.slotItems)) {
        return renderContent(normalizeSlot(SlotName.NO_MORE, slotProps, options.slotItems));
    }

    if (typeof options.content === 'function') {
        return renderContent(options.content(slotProps));
    }

    return renderContent(options.content);
}
