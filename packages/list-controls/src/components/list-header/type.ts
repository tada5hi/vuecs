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
    OptionsInput,
} from '@vue-layout/core';
import type { VNode, VNodeChild } from 'vue';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListFooterSlotProps } from '../list-footer';

type Content = VNodeChild | VNode | VNode[];
type ContentFn = (props: ListFooterSlotProps) => Content;

export type ListHeaderBuildOptions = ListBaseOptions & {
    content?: Content | ContentFn,
};

export type ListHeaderBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListHeaderBuildOptions>,
'content'
>;
