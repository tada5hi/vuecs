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

export type ListHeaderSlotProps<T, M = any> = ListBaseSlotProps<T, M>;

type Fn<T, M = any> = (props: ListHeaderSlotProps<T, M>) => VNodeChild;

export type ListHeaderBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    content?: VNodeChild | Fn<T, M>,
};

export type ListHeaderBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions<T, M>>,
OptionsInputValue<Pick<ListHeaderBuildOptions<T, M>, 'content'>
>>;
