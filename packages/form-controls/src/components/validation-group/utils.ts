/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from '@vue-layout/core';
import { isObject } from 'smob';
import type { ValidationRuleResultWithParams } from '../type';

export function isValidationRuleResultWithoutParams(input: unknown) : input is ValidationRuleResultWithParams {
    return isObject(input) &&
        hasOwnProperty(input, '$message') &&
        hasOwnProperty(input, '$pending') &&
        hasOwnProperty(input, '$invalid') &&
        hasOwnProperty(input, '$response');
}

export function isValidationRuleResultWithParams(input: unknown) : input is ValidationRuleResultWithParams {
    return isValidationRuleResultWithoutParams(input) &&
        hasOwnProperty(input, '$params');
}
