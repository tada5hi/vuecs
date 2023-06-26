/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef, OptionsOverride } from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListFooterBuildOptionsInput } from '../list-footer';
import type { ListHeaderBuildOptionsInput } from '../list-header';
import type { ListItemsBuildOptionsInput } from '../list-items';
import type { ListLoadingBuildOptionsInput } from '../list-loading';
import type { ListNoMoreBuildOptionsInput } from '../list-no-more';
import type {
    ListLoadFn,
} from '../type';

export type ListBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: MaybeRef<boolean>,
    data: MaybeRef<T[]>,
    load?: ListLoadFn,
    total?: number,

    onCreated?: (item: T) => any,
    onDeleted?: (item: T) => any,
    onUpdated?: (item: T) => any,

    header?: ListHeaderBuildOptionsInput | boolean,
    footer?: ListFooterBuildOptionsInput | boolean,

    items: Omit<ListItemsBuildOptionsInput<T>, 'busy' | 'data'> | boolean,
    loading: Omit<ListLoadingBuildOptionsInput<T>, 'busy'> | boolean,
    noMore: Omit<ListNoMoreBuildOptionsInput<T>, 'busy' | 'total'> | boolean
};

export type ListBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput &
OptionsOverride<
ExpectListBaseOptions<ListBuildOptions<T>>,
Partial<Pick<ListBuildOptions<T>, 'busy' | 'data'>>
>;
