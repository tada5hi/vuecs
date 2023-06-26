/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
} from '@vue-layout/core';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputCheckboxBuildOptions = FormBaseOptions & {
    groupClass: VNodeClass,
};

export type FormInputCheckboxBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsOverride<
    ExpectFormBaseOptions<FormInputCheckboxBuildOptions>,
    OptionsInputValue<PartialPick<FormInputCheckboxBuildOptions, 'groupClass'>>
    >;
