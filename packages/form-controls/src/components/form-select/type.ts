import type {
    ComponentOptionsInputValue, ComponentOptionsOverride, PartialPick,
} from '@vuecs/core';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormSelectOption = {
    id: string | number,
    value: unknown,
    disabled?: boolean,
};

export type FormSelectBuildOptions = FormBaseOptions & {
    options: FormSelectOption[],
    optionDefault: boolean,
    optionDefaultId: string | number,
    optionDefaultValue: string
};

export type FormSelectBuildOptionsInput =
    FormBaseOptionsInput
    & ComponentOptionsOverride<
    ExpectFormBaseOptions<FormSelectBuildOptions>,
    ComponentOptionsInputValue<PartialPick<FormSelectBuildOptions, 'optionDefault' | 'optionDefaultId' | 'optionDefaultValue'>>
    >;
