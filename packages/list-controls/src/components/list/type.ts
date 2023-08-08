/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsOverride, PartialPick } from '@vue-layout/core';
import type { MaybeRef } from 'vue';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListFooterBuildOptionsInput } from '../list-footer';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import type { ListBodyBuildOptionsInput } from '../list-body';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';

export type ListBuildOptions<T> = ListBaseOptions<T> & {
    data: MaybeRef<T[]>,

    header: ListHeaderBuildOptionsInput<T> | boolean,
    footer: ListFooterBuildOptionsInput<T> | boolean,
    body: Omit<ListBodyBuildOptionsInput<T>, 'busy' | 'data'> | boolean,
    loading: Omit<ListLoadingBuildOptionsInput<T>, 'busy'> | boolean,
    noMore: Omit<ListNoMoreBuildOptionsInput<T>, 'busy' | 'total'> | boolean
};

export type ListBuildOptionsInput<T> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListBuildOptions<T>>,
PartialPick<ListBuildOptions<T>, 'busy' | 'data' | 'header' | 'footer' | 'body' | 'loading' | 'noMore'>
>;
