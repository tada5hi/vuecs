import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h } from 'vue';
import {
    createComponentOptionsManager,
    hasNormalizedSlot,
    normalizeSlot,
} from '@vuecs/core';
import { Component, SlotName } from '../constants';
import type { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    const manager = createComponentOptionsManager<ValidationGroupOptions>({
        name: Component.VALIDATION,
    });

    return {
        ...options,

        slotItems: options.slotItems || {},

        itemClass: manager.buildOrFail({
            key: 'itemClass',
            value: options.itemClass,
            alt: [],
        }),
        itemTag: manager.buildOrFail({
            key: 'itemTag',
            value: options.itemTag,
            alt: 'div',
        }),

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
            itemClass: options.itemClass,
            itemTag: options.itemTag,
        }, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    for (let i = 0; i < errors.length; i++) {
        if (hasNormalizedSlot(SlotName.VALIDATION_ITEM, options.slotItems)) {
            children.push(normalizeSlot(SlotName.VALIDATION_ITEM, {
                class: options.itemClass,
                tag: options.itemTag,
                data: errors[i],
                dirty: options.dirty,
            }, options.slotItems));
        } else {
            children.push(h(options.itemTag, {
                class: options.itemClass,
            }, [errors[i]]));
        }
    }

    return children;
}
