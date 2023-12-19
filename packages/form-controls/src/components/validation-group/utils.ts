import { hasOwnProperty, isObject } from '@vuecs/core';
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

export function template(
    str: string,
    data: Record<string, any>,
    regex = /\{\{(.+?)\}\}/g,
) : string {
    return Array.from(str.matchAll(regex))
        .reduce((
            acc,
            match,
        ) => {
            if (typeof data[match[1]] !== 'undefined') {
                return acc.replace(match[0], data[match[1]]);
            }

            return acc;
        }, str);
}
