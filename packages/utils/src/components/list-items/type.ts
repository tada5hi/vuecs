/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, OptionsInput,
} from '../type';
import { ListItemBuildOptionsInput } from '../list-item';

export type ListItemsBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,

    item: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    data: T[],
};

export type ListItemsBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListItemsBuildOptions<T>>
>;
