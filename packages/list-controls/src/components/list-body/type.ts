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

export type ListBodySlotProps<T> = ListBaseSlotProps<T> & {
    data: T[],
    [key: string]: any
};

export type ListBodyBuildOptions<T> = ListBaseOptions<T> & {
    item?: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    data: MaybeRef<T[]>,
};

export type ListBodyBuildOptionsInput<T> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListBodyBuildOptions<T>>,
PartialPick<ListBodyBuildOptions<T>, 'busy' | 'data'>
>;
