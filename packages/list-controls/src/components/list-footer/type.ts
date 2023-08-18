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

import type {
    OptionsInputValue,
    OptionsOverride,
} from '@vue-layout/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListFooterSlotProps<T, M = any> = ListBaseSlotProps<T, M>;

type Fn<T, M = any> = (props: ListFooterSlotProps<T, M>) => VNodeChild;

export type ListFooterBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    content?: VNodeChild | Fn<T, M>,
};

export type ListFooterBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListFooterBuildOptions<T, M>>,
OptionsInputValue<Pick<ListFooterBuildOptions<T, M>, 'content'>
>>;
