/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PaginationMeta } from '../../static';
import { OptionsInput } from '../../type';
import { ComponentListLoadFn, ExpectListBaseBuildOptions, ListBaseOptions } from '../type';

export type ListPaginationBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    meta: Partial<PaginationMeta>,
    busy: boolean,
    load?: ComponentListLoadFn
};

export type ListPaginationBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
ExpectListBaseBuildOptions<ListPaginationBuildOptions<T>>,
never,
'load'
>;
