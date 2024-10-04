/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { createComponentOptionsManager } from '@vuecs/core';
import { Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListNoMoreBuildOptions, ListNoMoreBuildOptionsInput } from './type';

export function normalizeListNoMoreOptions<T, M = any>(
    input: ListNoMoreBuildOptionsInput<T, M>,
): ListNoMoreBuildOptions<T, M> {
    const options = normalizeListBaseOptions(input, Component.ListNoMore, {
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
