/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {VNodeProperties} from "../../../type";
import {OptionsInput} from "../../type";
import {
    ComponentListLoadFn,
    ExpectListBaseBuildOptions,
    ListActionRefreshOptionsInput,
    ListBaseOptions,
    ListTitleBuildOptionsInput
} from "../type";

export type ListHeaderBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    actionType: string,
    actionProps: VNodeProperties,
    actionRefresh: ListActionRefreshOptionsInput<T> | boolean,

    title: ListTitleBuildOptionsInput<T> | boolean,

    // slot scope
    busy: boolean,
    load: ComponentListLoadFn
};

export type ListHeaderBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
    ExpectListBaseBuildOptions<ListHeaderBuildOptions<T>>,
    never,
    'load'
    >;
