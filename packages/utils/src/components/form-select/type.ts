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

export type FormSelectOption = {
    id: string | number,
    value: any
};
export type FormSelectBuildOptions = FormBaseOptions & {
    options: FormSelectOption[],
    optionDefaultText: string,
};

export type FormSelectBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsInput<ExpectFormBaseOptions<FormSelectBuildOptions>,
    never,
    never,
    'options'>;
