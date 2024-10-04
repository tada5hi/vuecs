import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import { normalizeListHeaderOptions } from './normalize';
import type { ListHeaderBuildOptionsInput, ListHeaderSlotProps } from './type';

export function buildListHeader<T, M = any>(
    input?: ListHeaderBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = normalizeListHeaderOptions(input);

    let slotProps : ListHeaderSlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            ...options.slotProps,
        };
    }

    let content : VNodeArrayChildren = [];

    if (hasNormalizedSlot(SlotName.HEADER, options.slotItems)) {
        content = [
            normalizeSlot(SlotName.HEADER, slotProps, options.slotItems),
        ];
    } else if (options.content) {
        if (typeof options.content === 'function') {
            content = [options.content(slotProps)];
        } else {
            content = [options.content];
        }
    }

    if (content.length > 0) {
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
