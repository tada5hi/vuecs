import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import { buildListItem } from '../list-item';
import { normalizeListBodyOptions } from './normalize';
import type { ListBodyBuildOptionsInput, ListBodySlotProps } from './type';

export function buildListBody<T, M = any>(
    input?: ListBodyBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = normalizeListBodyOptions(input);

    let slotProps : ListBodySlotProps<T, M>;
    if (options.slotPropsBuilt) {
        slotProps = {
            data: options.data,
            ...options.slotProps,
        };
    } else {
        slotProps = {
            ...buildListBaseSlotProps<T, M>(options),
            data: options.data,
            ...options.slotProps,
        };
    }

    if (hasNormalizedSlot(SlotName.BODY, options.slotItems)) {
        return h(
            options.tag,
            mergeProps({ class: options.class }, options.props),
            normalizeSlot(SlotName.BODY, slotProps, options.slotItems),
        );
    }

    // ----------------------------------------------------------------------

    if (options.data.length === 0) {
        return [];
    }

    return h(
        options.tag,
        mergeProps({ class: options.class }, options.props),
        options.data.map((item: T, index) => buildListItem({
            slotProps,
            slotPropsBuilt: true,
            slotItems: options.slotItems,
            ...options.item,
            data: item,
            index,
            busy: options.busy,
        })),
    );
}
