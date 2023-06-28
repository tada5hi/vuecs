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

export type ListFooterSlotProps<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseSlotProps<T>;

type Fn<
    T extends Record<string, any> = Record<string, any>,
> = (props: ListFooterSlotProps<T>) => VNodeChild;

export type ListFooterBuildOptions<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseOptions<T> & {
    content?: VNodeChild | Fn<T>,
};

export type ListFooterBuildOptionsInput<
    T extends Record<string, any> = Record<string, any>,
> = ListBaseOptionsInput<T> &
OptionsOverride<
ExpectListBaseOptions<ListFooterBuildOptions<T>>,
OptionsInputValue<Pick<ListFooterBuildOptions<T>, 'content'>
>>;
