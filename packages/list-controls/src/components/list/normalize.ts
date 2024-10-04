/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CSSClassDefault, Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListBuildOptions, ListBuildOptionsInput } from './types';

export function normalizeListOptions<T, M = any>(
    input: ListBuildOptionsInput<T, M>,
): ListBuildOptions<T, M> {
    const options = normalizeListBaseOptions(input, Component.List, {
        class: CSSClassDefault.LIST,
    });

    return {
        ...options,

        data: input.data ?? [],

        header: input.header ?? true,
        footer: input.footer ?? true,
        body: input.body ?? true,
        loading: input.loading ?? true,
        noMore: input.noMore ?? true,
    };
}
