/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slots } from 'vue';
import { VNodeProperties } from '../../type';
import { PaginationMeta } from '../static';
import { OptionsInput } from '../type';

export type ComponentListLoadFn = (data?: PaginationMeta) => Promise<void> | void;

// --------------------------------------

export type ListBaseOptions = {
    slotItems: Slots,
    slotProps: Record<string, any>,

    type: string,
    props: VNodeProperties,
};

export type ListBaseBuildOptionsInput = OptionsInput<ListBaseOptions, never, 'slotItems'>;

export type ExpectListBaseBuildOptions<
    T extends ListBaseOptions | ListBaseBuildOptionsInput,
> = Omit<T, keyof ListBaseOptions | keyof ListBaseBuildOptionsInput>;

// --------------------------------------
