import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h } from 'vue';
import {
    hasNormalizedSlot,
    normalizeSlot,
} from '@vuecs/core';
import { SlotName } from '../constants';
import type { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    return {
        ...options,

        slotItems: options.slotItems || {},

        dirty: options.dirty ?? true,
        validationMessages: options.validationMessages || {},
    };
}

export function buildValidationGroup(input: ValidationGroupOptionsInput) : VNodeChild {
    const options = buildValidationGroupOptions(input);

    const keys = Object.keys(options.validationMessages);
    const errors : string[] = [];
    for (let i = 0; i < keys.length; i++) {
        errors.push(options.validationMessages[keys[i]]);
    }

    if (hasNormalizedSlot(SlotName.VALIDATION_GROUP, options.slotItems)) {
        return normalizeSlot(SlotName.VALIDATION_GROUP, {
            data: errors,
            dirty: options.dirty,
        }, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    for (let i = 0; i < errors.length; i++) {
        if (hasNormalizedSlot(SlotName.VALIDATION_ITEM, options.slotItems)) {
            children.push(normalizeSlot(SlotName.VALIDATION_ITEM, {
                data: errors[i],
                dirty: options.dirty,
            }, options.slotItems));
        } else {
            children.push(h('div', {
                class: 'form-group-hint group-required',
            }, [errors[i]]));
        }
    }

    return children;
}
