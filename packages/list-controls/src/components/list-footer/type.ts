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
    MaybeRef,
    OptionsInput,
} from '@vue-layout/core';
import type { VNode, VNodeChild } from 'vue';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';
import type { ListLoadFn } from '../type';

export type ListFooterSlotProps = {
    busy?: MaybeRef<boolean>,
    load?: ListLoadFn,
    total?: MaybeRef<number>,
};

type Content = VNodeChild | VNode | VNode[];
type ContentFn = (props: ListFooterSlotProps) => Content;

export type ListFooterBuildOptions = ListBaseOptions & {
    content?: Content | ContentFn,
};

export type ListFooterBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListFooterBuildOptions>,
'content'
>;
