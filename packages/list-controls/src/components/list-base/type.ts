/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Slots } from 'vue';
import type {
    OptionsInputValue,
    OptionsOverride,
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
export type ListBaseOptionsInput = OptionsOverride<
ListBaseOptions,
Partial<Pick<ListBaseOptions, 'slotItems' | 'slotProps'>> &
Partial<Pick<OptionsInputValue<ListBaseOptions>, 'tag' | 'class' | 'props'>>
>;

export type ExpectListBaseOptions<T > = Omit<T, keyof ListBaseOptions>;

export type ListBaseOptionsDefaults = {
    [K in keyof ListBaseOptions]?: ListBaseOptions[K]
};
