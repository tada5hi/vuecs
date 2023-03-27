/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsInput } from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type {
    ListLoadFn, ListLoadMeta,
} from '../type';

export type ListPaginationBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,
    meta: Partial<ListLoadMeta>,
    load?: ListLoadFn
};

export type ListPaginationBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListPaginationBuildOptions<T>>,
never,
'load'
>;
