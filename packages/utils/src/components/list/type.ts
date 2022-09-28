/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef, OptionsInput } from '@vue-layout/core';
import { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import { ListHeaderBuildOptionsInput } from '../list-header';
import { ListItemsBuildOptionsInput } from '../list-items';
import { ListNoMoreBuildOptionsInput } from '../list-no-more';
import { ListPaginationBuildOptionsInput } from '../list-pagination';
import { ListSearchBuildOptionsInput } from '../list-search';
import {
    ListLoadFn, ListLoadMeta,
} from '../type';

export type ListBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy?: MaybeRef<boolean>,
    data?: MaybeRef<T[]>,
    load?: ListLoadFn,
    meta?: MaybeRef<Partial<ListLoadMeta>>,
    change?: (input: any) => void,

    header: Omit<ListHeaderBuildOptionsInput, 'busy' | 'load'> | boolean,
    search: Omit<ListSearchBuildOptionsInput, 'change'> | boolean,
    items: Omit<ListItemsBuildOptionsInput<T>, 'busy' | 'data'> | boolean,
    noMore: Omit<ListNoMoreBuildOptionsInput<T>, 'busy' | 'total'> | boolean
    pagination: Omit<ListPaginationBuildOptionsInput<T>, 'busy' | 'meta' | 'load'> | boolean,
};

export type ListBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListBuildOptions<T>>,
'load',
'busy' | 'data' | 'meta' | 'change'
>;
