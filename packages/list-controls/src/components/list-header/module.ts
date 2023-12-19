import { createOptionBuilder, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import { h, mergeProps } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { Component, SlotName } from '../constants';
import { buildListBaseOptions, buildListBaseSlotProps } from '../list-base';
import type { ObjectLiteral } from '../type';
import type { ListHeaderBuildOptions, ListHeaderBuildOptionsInput, ListHeaderSlotProps } from './type';

export function buildListHeaderOptions<T, M = any>(
    input: ListHeaderBuildOptionsInput<T, M>,
) : ListHeaderBuildOptions<T, M> {
    const options = buildListBaseOptions(
        input,
        Component.ListHeader,
        {
            class: 'list-header',
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

export function buildListHeader<T, M = any>(
    input?: ListHeaderBuildOptionsInput<T, M>,
) : VNodeChild {
    input = input || {};
    const options = buildListHeaderOptions(input);

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
