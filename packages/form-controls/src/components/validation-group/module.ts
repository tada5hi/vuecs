import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h } from 'vue';
import {
    createComponentOptionsManager,
    hasNormalizedSlot,
    normalizeSlot,
} from '@vuecs/core';
import { Component, SlotName, ValidationSeverity } from '../constants';
import type { ValidationMessagesArrayStyle } from '../type';
import type { ValidationGroupOptions, ValidationGroupOptionsInput } from './type';

export function buildValidationGroupOptions(options: ValidationGroupOptionsInput) : ValidationGroupOptions {
    const manager = createComponentOptionsManager<ValidationGroupOptions>({ name: Component.VALIDATION_GROUP });

    return {
        ...options,

        slotItems: options.slotItems || {},

        itemClass: manager.buildOrFail({
            key: 'itemClass',
            value: options.itemClass,
            alt: 'form-group-hint group-required',
        }),
        itemTag: manager.buildOrFail({
            key: 'itemTag',
            value: options.itemTag,
            alt: 'div',
        }),

        severity: options.severity || ValidationSeverity.ERROR,
        messages: options.messages || {},
    };
}

export function buildValidationGroup(input: ValidationGroupOptionsInput) : VNodeChild {
    const options = buildValidationGroupOptions(input);

    let errors : ValidationMessagesArrayStyle;

    if (Array.isArray(options.messages)) {
        errors = options.messages;
    } else {
        errors = [];
        const keys = Object.keys(options.messages);
        for (const key of keys) {
            errors.push({
                key,
                value: options.messages[key],
            });
        }
    }

    if (hasNormalizedSlot(SlotName.VALIDATION_GROUP, options.slotItems)) {
        return normalizeSlot(SlotName.VALIDATION_GROUP, {
            data: errors,
            severity: options.severity,
            itemClass: options.itemClass,
            itemTag: options.itemTag,
        }, options.slotItems);
    }

    const children : VNodeArrayChildren = [];

    for (const error of errors) {
        if (hasNormalizedSlot(SlotName.VALIDATION_ITEM, options.slotItems)) {
            children.push(normalizeSlot(SlotName.VALIDATION_ITEM, {
                key: error.key,
                value: error.value,
                class: options.itemClass,
                tag: options.itemTag,
                severity: options.severity,
            }, options.slotItems));
        } else {
            children.push(h(options.itemTag, { class: options.itemClass }, [error.value]));
        }
    }

    return children;
}
