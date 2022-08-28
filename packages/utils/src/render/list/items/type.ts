/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {OptionsInput} from "../../type";
import {ExpectListBaseBuildOptions, ListBaseOptions, ListItemBuildOptionsInput} from "../type";

export type ListItemsBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean,

    item: Omit<ListItemBuildOptionsInput<T>, 'data' | 'index'>,
    items: T[],
};

export type ListItemsBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
    ExpectListBaseBuildOptions<ListItemsBuildOptions<T>>
    >;
