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

export type ListFooterSlotProps = ListBaseSlotProps;

type Fn = (props: ListFooterSlotProps) => VNodeChild;

export type ListFooterBuildOptions = ListBaseOptions & {
    content?: VNodeChild | Fn,
};

export type ListFooterBuildOptionsInput = ListBaseOptionsInput &
OptionsOverride<
ExpectListBaseOptions<ListFooterBuildOptions>,
OptionsInputValue<Pick<ListFooterBuildOptions, 'content'>
>>;
