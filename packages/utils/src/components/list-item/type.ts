/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode } from 'vue';
import { VNodeClass, VNodeProperties } from '../../type';
import { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import {
    OptionsInput,
} from '../type';

export type ListItemBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    data: T,
    fn?: (item: T, index?: number) => VNode,

    icon: boolean,
    iconClass: VNodeClass,
    iconProps: VNodeProperties,

    textFn?: (item: T) => string | VNode | (string | VNode)[],
    textPropName: string,

    index?: number,
    key?: string,

    actions: VNode | VNode[],
    busy: boolean
};

export type ListItemBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListItemBuildOptions<T>>,
never,
'actions' | 'fn' | 'textFn',
'data'
>;
