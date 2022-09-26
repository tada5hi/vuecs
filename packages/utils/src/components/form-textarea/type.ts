/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';
import {
    OptionsInput,
} from '../type';

export type FormTextareaBuildOptions = FormBaseOptions;

export type FormTextareaBuildOptionsInput = FormBaseOptionsInput &
OptionsInput<ExpectFormBaseOptions<FormTextareaBuildOptions>>;
