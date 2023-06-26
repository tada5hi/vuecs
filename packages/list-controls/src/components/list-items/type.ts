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
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListItemBuildOptionsInput } from '../list-item';

export type ListItemsBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,

    item?: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    itemKey?: keyof T,
    itemId?: (item: T) => string,
    data: MaybeRef<T[]>,

    onDeleted?: (item: T) => void,
    onUpdated?: (item: T) => void
};

export type ListItemsBuildOptionsInput<
    T extends Record<string, any>,
> = ListBaseOptionsInput &
OptionsOverride<
ExpectListBaseOptions<ListItemsBuildOptions<T>>,
PartialPick<ListItemsBuildOptions<T>, 'busy' | 'data'>
>;

export type ListItemsSlotProps<T> = {
    data: T[],
    busy: boolean,
    deleted: (item: T) => void,
    updated: (item: T) => void,
    [key: string]: any
};
