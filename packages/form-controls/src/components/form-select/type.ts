/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    OptionsInputValue, OptionsOverride, PartialPick,
} from '@vue-layout/core';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormSelectOption = {
    id: string | number,
    value: any
};
export type FormSelectBuildOptions = FormBaseOptions & {
    options: FormSelectOption[],
    optionDefault: boolean,
    optionDefaultId: string | number,
    optionDefaultValue: string
};

export type FormSelectBuildOptionsInput =
    FormBaseOptionsInput
    & OptionsOverride<
    ExpectFormBaseOptions<FormSelectBuildOptions>,
    OptionsInputValue<PartialPick<FormSelectBuildOptions, 'optionDefault' | 'optionDefaultId' | 'optionDefaultValue'>>
    >;
