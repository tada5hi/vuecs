/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode } from 'vue';
import { Component } from '../constants';
import {
    FormInputBuildOptionsInput,
    buildFormInputFromOptions,
    buildFormInputOptions,
} from '../form-input';

export function buildFormInputText(
    input: FormInputBuildOptionsInput,
) : VNode {
    const options = buildFormInputOptions(input, Component.FormInputText);

    return buildFormInputFromOptions(options);
}
