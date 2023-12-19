import { createOptionBuilder, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import { h, mergeProps } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ListFooterBuildOptions, ListFooterBuildOptionsInput, ListFooterSlotProps } from './type';

export function buildListFooterOptions<T, M = any>(
    input: ListFooterBuildOptionsInput<T, M>,
) : ListFooterBuildOptions<T, M> {
    const options = buildListBaseOptions(
        input,
        Component.ListFooter,
        {
            class: 'list-footer',
        },
    );

    const { buildOrFail } = createOptionBuilder(
        Component.ListHeader,
    );

    return {
        ...options,

        content: buildOrFail({
            key: 'content',
            value: input.content,
            alt: [],
        }),
    };
}

export function buildListFooter<T, M = any>(
    input?: ListFooterBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = buildListFooterOptions(input);

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
