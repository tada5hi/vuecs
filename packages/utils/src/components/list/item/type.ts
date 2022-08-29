/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {VNode} from "vue";
import {VNodeProperties} from "../../../type";
import {OptionsInput} from "../../type";
import {ExpectListBaseBuildOptions, ListBaseOptions} from "../type";

export type ListItemBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    data: T,
    fn?: (item: T, index?: number) => VNode,

    icon: boolean,
    iconProps: VNodeProperties,

    textFn?: (item: T) => string | VNode | (string | VNode)[],
    textPropName: string,

    index?: number,
    key?: string,

    actions: VNode | VNode[],
    busy: boolean
};

export type ListItemBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
    ExpectListBaseBuildOptions<ListItemBuildOptions<T>>,
    never,
    'actions' | 'fn' | 'textFn',
    'data'
    >;
