import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride,
    PartialPick,
    VNodeClass,
} from '@vuecs/core';
import type { Slots, VNodeChild } from 'vue';
import type { ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsInput } from '../form-base';

export type FormInputBuildOptions = FormBaseOptions & {
    slotItems: Slots,

    type: string,
    group: boolean,
    groupClass: VNodeClass,

    groupPrepend: boolean,
    groupPrependClass?: VNodeClass,
    groupPrependContent?: VNodeChild,

    groupAppend: boolean,
    groupAppendClass?: VNodeClass,
    groupAppendContent?: VNodeChild
};

export type FormInputBuildOptionsInput =
    FormBaseOptionsInput
    & ComponentOptionsOverride<
    ExpectFormBaseOptions<FormInputBuildOptions>,
    ComponentOptionsInputValue<PartialPick<FormInputBuildOptions,
    'type' |
    'group' |
    'groupClass' |
    'groupPrepend' |
    'groupPrependClass' |
    'groupPrependContent' |
    'groupAppend' |
    'groupAppendClass' |
    'groupAppendContent' |
    'slotItems'
    >>
    >;
