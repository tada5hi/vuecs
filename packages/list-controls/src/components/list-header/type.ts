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

export type ListHeaderSlotProps<T> = ListBaseSlotProps<T>;

type Fn<T> = (props: ListHeaderSlotProps<T>) => VNodeChild;

export type ListHeaderBuildOptions<T> = ListBaseOptions<T> & {
    content?: VNodeChild | Fn<T>,
};

export type ListHeaderBuildOptionsInput<T> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions<T>>,
OptionsInputValue<Pick<ListHeaderBuildOptions<T>, 'content'>
>>;
