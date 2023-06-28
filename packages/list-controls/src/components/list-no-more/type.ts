/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue,
    OptionsOverride,
    PartialPick,
} from '@vue-layout/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListNoMoreSlotProps<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseSlotProps<T>;

type Fn<
    T extends Record<string, any>,
> = (props: ListNoMoreSlotProps<T>) => VNodeChild;

export type ListNoMoreBuildOptions<T extends Record<string, any>> = ListBaseOptions<T> & {
    content: VNodeChild | Fn<T>
};

export type ListNoMoreBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListNoMoreBuildOptions<T>>,
OptionsInputValue<PartialPick<ListNoMoreBuildOptions<T>, 'content'>>
>;
