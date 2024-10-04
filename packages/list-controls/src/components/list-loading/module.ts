import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import { normalizeListLoadingOptions } from './normalize';
import type { ListLoadingBuildOptionsInput, ListLoadingSlotProps } from './type';

export function buildListLoading<T, M = any>(
    input?: ListLoadingBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};

    const options = normalizeListLoadingOptions(input);

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
