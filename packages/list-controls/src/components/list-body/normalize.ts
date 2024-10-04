/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { CSSClassDefault, Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListBodyBuildOptions, ListBodyBuildOptionsInput } from './type';

export function normalizeListBodyOptions<T, M = any>(
    input: ListBodyBuildOptionsInput<T, M>,
): ListBodyBuildOptions<T, M> {
    const options = normalizeListBaseOptions(
        input,
        Component.ListBody,
        {
            class: CSSClassDefault.LIST_BODY,
            tag: 'ul',
        },
    );

    return {
        ...options,

        data: input.data || [],
        item: input.item,
    };
}
