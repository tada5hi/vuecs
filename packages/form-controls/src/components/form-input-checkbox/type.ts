import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride, PartialPick,
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
& ComponentOptionsOverride<
ExpectFormBaseOptions<FormInputCheckboxBuildOptions>,
ComponentOptionsInputValue<PartialPick<FormInputCheckboxBuildOptions, 'groupClass' | 'label' | 'labelClass' | 'labelContent'>> &
PartialPick<FormInputCheckboxBuildOptions, 'group'>
>;

export type FormInputCheckboxLabelSlotProps = {
    class: VNodeClass,
    id: string
};
