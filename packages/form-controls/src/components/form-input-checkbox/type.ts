import type {
    OptionsInputValue,
    OptionsOverride, PartialPick,
    VNodeClass,
} from '@vuecs/core';
import type { VNodeChild } from 'vue/dist/vue';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputCheckboxBuildOptions = FormBaseOptions & {
    group: boolean,
    groupClass: VNodeClass,

    label: boolean,
    labelClass: VNodeClass,
    labelContent: VNodeChild,
};

export type FormInputCheckboxBuildOptionsInput = FormBaseOptionsInput
& OptionsOverride<
ExpectFormBaseOptions<FormInputCheckboxBuildOptions>,
OptionsInputValue<PartialPick<FormInputCheckboxBuildOptions, 'groupClass' | 'label' | 'labelClass' | 'labelContent'>> &
PartialPick<FormInputCheckboxBuildOptions, 'group'>
>;

export type FormInputCheckboxLabelSlotProps = {
    class: VNodeClass,
    id: string
};
