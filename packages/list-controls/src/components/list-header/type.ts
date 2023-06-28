/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsInputValue, OptionsOverride } from '@vue-layout/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListHeaderSlotProps<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseSlotProps<T>;

type Fn<
    T extends Record<string, any>,
> = (props: ListHeaderSlotProps<T>) => VNodeChild;

export type ListHeaderBuildOptions<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseOptions<T> & {
    content?: VNodeChild | Fn<T>,
};

export type ListHeaderBuildOptionsInput<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions<T>>,
OptionsInputValue<Pick<ListHeaderBuildOptions<T>, 'content'>
>>;
