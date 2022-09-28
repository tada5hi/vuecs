/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    OptionsInput,
    VNodeClass,
} from '@vue-layout/core';
import { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputCheckboxBuildOptions = FormBaseOptions & {
    groupClass: VNodeClass,
};

export type FormInputCheckboxBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsInput<ExpectFormBaseOptions<FormInputCheckboxBuildOptions>>;
