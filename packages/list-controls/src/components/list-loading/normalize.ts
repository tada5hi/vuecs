/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { Component } from '../constants';
import { normalizeListBaseOptions } from '../list-base';
import type { ListLoadingBuildOptions, ListLoadingBuildOptionsInput } from './type';

export function normalizeListLoadingOptions<T, M = any>(
    input: ListLoadingBuildOptionsInput<T, M>,
): ListLoadingBuildOptions<T, M> {
    const options = normalizeListBaseOptions(input, Component.ListLoading, {
        class: 'list-loading',
    });

    return {
        ...options,
    };
}
