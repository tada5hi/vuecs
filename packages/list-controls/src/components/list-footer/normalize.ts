/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { createComponentOptionsManager } from '@vuecs/core';
import { CSSClassDefault, Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListFooterBuildOptions, ListFooterBuildOptionsInput } from './type';

export function normalizeListFooterOptions<T, M = any>(
    input: ListFooterBuildOptionsInput<T, M>,
): ListFooterBuildOptions<T, M> {
    const options = normalizeListBaseOptions(
        input,
        Component.ListFooter,
        {
            class: CSSClassDefault.LIST_FOOTER,
        },
    );

    const manager = createComponentOptionsManager<ListFooterBuildOptions<T, M>>({
        name: Component.ListFooter,
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
