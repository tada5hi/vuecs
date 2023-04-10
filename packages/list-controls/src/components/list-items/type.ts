/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    MaybeRef,
    OptionsInput,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListItemBuildOptionsInput } from '../list-item';

export type ListItemsBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,

    item: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    data: MaybeRef<T[]>,

    onDeleted?: (item: T) => void,
    onUpdated?: (item: T) => void,
    filterFn?: (item: T) => boolean
};

export type ListItemsBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListItemsBuildOptions<T>>,
never,
'data' | 'onDeleted' | 'onUpdated' | 'filterFn'
>;

export type ListItemsSlotProps<T> = {
    data: T[],
    busy: boolean,
    deleted: (item: T) => void,
    updated: (item: T) => void,
    [key: string]: any
};
