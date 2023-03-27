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
import type { ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput } from '../list-base';

export type ListSearchBuildOptions = ListBaseOptions & {
    value?: MaybeRef<unknown>,

    onChange?: (input: any) => void,
};

export type ListSearchBuildOptionsInput = ListBaseOptionsInput & OptionsInput<
ExpectListBaseOptions<ListSearchBuildOptions>,
never,
'onChange'
>;
