/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from 'vue';
import type {
    OptionsOverride, PartialPick,
} from '@vue-layout/core';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';
import type { ListItemBuildOptionsInput } from '../list-item';
import type { ObjectLiteral } from '../type';

export type ListBodySlotProps<T, M = any> = ListBaseSlotProps<T, M> & {
    data: T[],
    [key: string]: any
};

export type ListBodyBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    item?: Omit<ListItemBuildOptionsInput<T, M>, 'data' | 'index'>,
    data: MaybeRef<T[]>,
};

export type ListBodyBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListBodyBuildOptions<T, M>>,
PartialPick<ListBodyBuildOptions<T, M>, 'busy' | 'data'>
>;
