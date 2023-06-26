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
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListFooterSlotProps } from '../list-footer';

type Fn = (props: ListFooterSlotProps) => VNodeChild;

export type ListHeaderBuildOptions = ListBaseOptions & {
    content?: VNodeChild | Fn,
};

export type ListHeaderBuildOptionsInput = ListBaseOptionsInput &
OptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions>,
OptionsInputValue<Pick<ListHeaderBuildOptions, 'content'>
>>;
