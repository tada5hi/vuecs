import type { VNodeChild } from 'vue';
import { Component } from '../constants';
import type { FormInputBuildOptionsInput } from '../form-input';
import {
    buildFormInputFromOptions,
    buildFormInputOptions,
} from '../form-input';

export function buildFormInputText(
    input: FormInputBuildOptionsInput,
) : VNodeChild {
    const options = buildFormInputOptions(input, Component.FormInputText);

    return buildFormInputFromOptions(options);
}
