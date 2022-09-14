/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    ExpectListBaseOptions, ListBaseOptions, ListLoadFn, OptionsInput,
} from '../type';
import { PaginationMeta } from '../pagination';

export type ListPaginationBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,
    meta: Partial<PaginationMeta>,
    load?: ListLoadFn
};

export type ListPaginationBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ExpectListBaseOptions<ListPaginationBuildOptions<T>>,
never,
'load'
>;
