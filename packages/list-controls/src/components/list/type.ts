/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsOverride, PartialPick } from '@vue-layout/core';
import type { MaybeRef } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';
import type { ListFooterBuildOptionsInput } from '../list-footer';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import type { ListBodyBuildOptionsInput } from '../list-body';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';

export type ListBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    data: MaybeRef<T[]>,
    total?: number,

    header: ListHeaderBuildOptionsInput<T, M> | boolean,
    footer: ListFooterBuildOptionsInput<T, M> | boolean,
    body: Omit<ListBodyBuildOptionsInput<T, M>, 'busy' | 'data'> | boolean,
    loading: Omit<ListLoadingBuildOptionsInput<T, M>, 'busy'> | boolean,
    noMore: Omit<ListNoMoreBuildOptionsInput<T, M>, 'busy' | 'total'> | boolean
};

export type ListBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListBuildOptions<T, M>>,
PartialPick<ListBuildOptions<T, M>, 'busy' | 'data' | 'header' | 'footer' | 'body' | 'loading' | 'noMore'>
>;

export type ListSlotProps<T, M = any> = ListBaseSlotProps<T, M> & {
    data: T[],
    [key: string]: any
};
