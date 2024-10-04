import {
    hasNormalizedSlot, hasOwnProperty, isObject, normalizeSlot,
} from '@vuecs/core';
import type { VNodeChild } from 'vue';
import { h, mergeProps } from 'vue';
import { SlotName } from '../constants';
import { buildListBaseSlotProps } from '../list-base';
import { normalizeListNoMoreOptions } from './normalize';
import type { ListNoMoreBuildOptionsInput, ListNoMoreSlotProps } from './type';

export function buildListNoMore<T, M = any>(
    input: ListNoMoreBuildOptionsInput<T, M> = {},
) : VNodeChild {
    const options = normalizeListNoMoreOptions(input);

    if (options.busy) {
        return [];
    }

    if (typeof options.total === 'number') {
        if (options.total > 0) {
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
