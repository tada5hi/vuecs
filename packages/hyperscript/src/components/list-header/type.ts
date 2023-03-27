/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    MaybeRef, OptionsInput, VNodeClass, VNodeProperties,
} from '@vue-layout/core';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type {
    ListLoadFn,
} from '../type';
import type { ListActionRefreshBuildOptionsInput } from '../list-action-refresh';
import type { ListTitleBuildOptionsInput } from '../list-title';

export type ListHeaderBuildOptions = ListBaseOptions & {
    actionType: string,
    actionClass: VNodeClass,
    actionProps: VNodeProperties,
    actionRefresh: ListActionRefreshBuildOptionsInput | boolean,

    title: ListTitleBuildOptionsInput | boolean,

    // slot scope
    busy: MaybeRef<boolean>,
    load: ListLoadFn
};

export type ListHeaderBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListHeaderBuildOptions>,
never,
'load' | 'busy'
>;
