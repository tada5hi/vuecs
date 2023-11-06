/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h } from 'vue';
import {
    hasNormalizedSlot, isObject, normalizeSlot,
} from '@vue-layout/core';
import { SlotName } from '../constants';
import { isValidationRuleResultWithParams, isValidationRuleResultWithoutParams, template } from './utils';
import type { ValidationResult } from '../type';
import type { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    return {
        ...options,

        slotItems: options.slotItems || {},

        validationMessages: options.validationMessages || {},
        validationResult: options.validationResult || {} as ValidationResult<unknown>,
    };
}

export function buildValidationGroup(input: ValidationGroupOptionsInput) : VNodeChild {
    const options = buildValidationGroupOptions(input);

    const translate = (validator: string, properties?: Record<string, any>) => {
        if (
            options.validationMessages &&
            Object.prototype.hasOwnProperty.call(options.validationMessages, validator)
        ) {
            return template(options.validationMessages[validator], properties || {});
        }

        if (typeof options.validationTranslator !== 'undefined') {
            let translation = options.validationTranslator(validator, properties || {});
            if (typeof translation === 'string') {
                translation = template(translation, properties || {});
                if (translation !== validator) {
                    return translation;
                }
            }
        }

        return `The ${validator} operator condition is not fulfilled.`;
    };

    const errors : string[] = [];
    const keys = Object.keys(options.validationResult);
    for (let i = 0; i < keys.length; i++) {
        if (
            isObject(options.validationResult[keys[i]]) &&
            options.validationResult[keys[i]].$invalid
        ) {
            if (isValidationRuleResultWithParams(options.validationResult[keys[i]])) {
                errors.push(translate(keys[i], options.validationResult[keys[i]].$params));
            } else if (isValidationRuleResultWithoutParams(options.validationResult[keys[i]])) {
                errors.push(translate(keys[i]));
            }
        }
    }

    const invalid : boolean = !!options.validationResult &&
        !!options.validationResult.$dirty &&
        !!options.validationResult.$invalid;

    if (hasNormalizedSlot(SlotName.VALIDATION_GROUP, options.slotItems)) {
        return normalizeSlot(SlotName.VALIDATION_GROUP, { data: errors, invalid }, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    for (let i = 0; i < errors.length; i++) {
        if (hasNormalizedSlot(SlotName.VALIDATION_ITEM, options.slotItems)) {
            children.push(normalizeSlot(SlotName.VALIDATION_ITEM, { data: errors[i], invalid }, options.slotItems));
        } else {
            children.push(h('div', {
                class: 'form-group-hint group-required',
            }, [errors[i]]));
        }
    }

    return children;
}
