/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slots } from 'vue';
import {
    OptionsInput,
    VNodeClass,
    VNodeProperties,
} from '@vue-layout/core';

export type ListBaseOptions = {
    slotItems: Slots,
    slotProps: Record<string, any>,

    tag: string,
    class: VNodeClass,
    props: VNodeProperties,
};
export type ListBaseOptionsInput = OptionsInput<ListBaseOptions, never, 'slotItems'>;

export type ExpectListBaseOptions<T extends ListBaseOptions | ListBaseOptionsInput,
    > = Omit<T, keyof ListBaseOptions | keyof ListBaseOptionsInput>;

export type ListBaseOptionsDefaults = {
    [K in keyof ListBaseOptions]?: ListBaseOptions[K]
};
