import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import { normalizeListFooterOptions } from './normalize';
import type { ListFooterBuildOptionsInput, ListFooterSlotProps } from './type';

export function buildListFooter<T, M = any>(
    input?: ListFooterBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = normalizeListFooterOptions(input);

    let slotProps : ListFooterSlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = options.slotProps;
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            ...options.slotProps,
        };
    }

    let children : VNodeArrayChildren = [];

    if (hasNormalizedSlot(SlotName.FOOTER, options.slotItems)) {
        children = [
            normalizeSlot(SlotName.FOOTER, slotProps, options.slotItems),
        ];
    } else if (options.content) {
        if (typeof options.content === 'function') {
            children = [options.content(slotProps)];
        } else {
            children = [options.content];
        }
    }

    if (children.length > 0) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            [
                children,
            ],
        );
    }

    return [];
}
