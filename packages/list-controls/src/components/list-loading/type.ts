/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OptionsOverride, PartialPick } from '@vue-layout/core';
import type { MaybeRef } from 'vue';
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListLoadingBuildOptions<T extends Record<string, any>> = ListBaseOptions & {
    busy: boolean
};

export type ListLoadingBuildOptionsInput<T extends Record<string, any>> = ListBaseOptionsInput &
OptionsOverride<
ExpectListBaseOptions<ListLoadingBuildOptions<T>>,
PartialPick<ListLoadingBuildOptions<T>, 'busy'>
>;
