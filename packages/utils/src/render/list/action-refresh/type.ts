/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {VNode, VNodeChild} from "vue";
import {VNodeProperties} from "../../../type";
import {OptionsInput} from "../../type";
import {ComponentListLoadFn, ExpectListBaseBuildOptions, ListBaseOptions} from "../type";

export type ListActionRefreshBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    text: boolean,
    textContent: VNodeChild | VNode | VNode[],

    icon: boolean,
    iconProps: VNodeProperties,

    busy: boolean,
    load: ComponentListLoadFn,
};

export type ListActionRefreshOptionsInput<T extends Record<string, any>> = OptionsInput<
    ExpectListBaseBuildOptions<ListActionRefreshBuildOptions<T>>,
    never,
    'load'
    >;
