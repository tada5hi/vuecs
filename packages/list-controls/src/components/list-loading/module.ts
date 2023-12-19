import type { VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import {
    hasNormalizedSlot,
    normalizeSlot,
} from '@vuecs/core';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListLoadingBuildOptions, ListLoadingBuildOptionsInput, ListLoadingSlotProps } from './type';

export function buildListLoadingOptions<T, M = any>(
    input: ListLoadingBuildOptionsInput<T, M>,
) : ListLoadingBuildOptions<T, M> {
    const options = buildListBaseOptions(input, Component.ListLoading, {
        class: 'list-loading',
    });

    return {
        ...options,
    };
}

export function buildListLoading<T, M = any>(
    input?: ListLoadingBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};

    const options = buildListLoadingOptions(input);

    let slotProps : ListLoadingSlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            ...options.slotProps,
        };
    }

    if (!options.busy) {
        return [];
    }

    let content : VNodeChild | undefined;

    if (hasNormalizedSlot(SlotName.LOADING, options.slotItems)) {
        content = normalizeSlot(SlotName.LOADING, slotProps, options.slotItems);
    } if (options.content) {
        if (typeof options.content === 'function') {
            content = [options.content(slotProps)];
        } else {
            content = [options.content];
        }
    }

    if (content) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            [
                content,
            ],
        );
    }

    return [];
}
