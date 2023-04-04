/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, OptionsInput } from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import type { ListItemsBuildOptionsInput } from '../list-items';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';
import type { ListPaginationBuildOptionsInput } from '../list-pagination';
import type { ListSearchBuildOptionsInput } from '../list-search';
import type {
    ListLoadFn, ListLoadMeta,
} from '../type';

export type ListBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy?: MaybeRef<boolean>,
    data?: MaybeRef<T[]>,
    load?: ListLoadFn,
    meta?: MaybeRef<Partial<ListLoadMeta>>,

    onChange?: (input: any) => void,
    onDeleted?: (item: T) => void,
    onUpdated?: (item: T) => void,

    header: Omit<ListHeaderBuildOptionsInput, 'busy' | 'load'> | boolean,
    search: Omit<ListSearchBuildOptionsInput, 'onChange'> | boolean,
    items: Omit<ListItemsBuildOptionsInput<T>, 'busy' | 'data'> | boolean,
    loading: Omit<ListLoadingBuildOptionsInput<T>, 'busy'> | boolean
    noMore: Omit<ListNoMoreBuildOptionsInput<T>, 'busy' | 'total'> | boolean
    pagination: Omit<ListPaginationBuildOptionsInput<T>, 'busy' | 'meta' | 'load'> | boolean,
};

export type ListBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListBuildOptions<T>>,
'load',
'busy' | 'data' | 'meta' | 'onChange' | 'onDeleted' | 'onUpdated'
>;
