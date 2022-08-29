/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNodeProperties } from '../../../type';
import { OptionsInput } from '../../type';
import { ListActionRefreshBuildOptionsInput } from '../action-refresh';
import { ListTitleBuildOptionsInput } from '../title';
import {
    ComponentListLoadFn,
    ExpectListBaseBuildOptions,
    ListBaseOptions,
} from '../type';

export type ListHeaderBuildOptions = ListBaseOptions & {
    actionType: string,
    actionProps: VNodeProperties,
    actionRefresh: ListActionRefreshBuildOptionsInput | boolean,

    title: ListTitleBuildOptionsInput<T> | boolean,

    // slot scope
    busy: boolean,
    load: ComponentListLoadFn
};

export type ListHeaderBuildOptionsInput = OptionsInput<
ExpectListBaseBuildOptions<ListHeaderBuildOptions>,
never,
'load'
>;
