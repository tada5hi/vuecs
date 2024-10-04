/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { createComponentOptionsManager } from '@vuecs/core';
import { CSSClassDefault, Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListHeaderBuildOptions, ListHeaderBuildOptionsInput } from './type';

export function normalizeListHeaderOptions<T, M = any>(
    input: ListHeaderBuildOptionsInput<T, M>,
): ListHeaderBuildOptions<T, M> {
    const options = normalizeListBaseOptions(
        input,
        Component.ListHeader,
        {
            class: CSSClassDefault.LIST_HEADER,
        },
    );

    const manager = createComponentOptionsManager<ListHeaderBuildOptions<T, M>>({
        name: Component.ListHeader,
    });

    return {
        ...options,

        content: manager.buildOrFail({
            key: 'content',
            value: input.content,
            alt: [],
        }),
    };
}
