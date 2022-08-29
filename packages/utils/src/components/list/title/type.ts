/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {VNodeProperties} from "../../../type";
import {VNode, VNodeChild} from "vue";
import {OptionsInput} from "../../type";
import {ExpectListBaseBuildOptions, ListBaseOptions} from "../type";

export type ListTitleBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    text: boolean,
    textProps: VNodeProperties,
    textContent: VNodeChild | VNode | VNode[],

    icon: boolean,
    iconProps: VNodeProperties
};

export type ListTitleBuildOptionsInput<T extends Record<string, any>> = OptionsInput<
    ExpectListBaseBuildOptions<ListTitleBuildOptions<T>>>;
