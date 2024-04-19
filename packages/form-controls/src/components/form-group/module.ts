import type { VNodeClass } from '@vuecs/core';
import { createComponentOptionsManager, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import { h } from 'vue';
import { Component, SlotName } from '../constants';
import { buildValidationGroup } from '../validation-group';
import type {
    FormGroupOptions, FormGroupOptionsInput,
} from './type';

export function buildFormGroupOptions(
    input: FormGroupOptionsInput,
) : FormGroupOptions {
    const manager = createComponentOptionsManager<FormGroupOptions>({
        name: Component.FormGroup,
    });

    return {
        ...input,

        slotItems: input.slotItems || {},

        hint: manager.build({
            key: 'hint',
            value: input.hint,
        }),
        hintClass: manager.buildOrFail({
            key: 'hintClass',
            value: input.hintClass,
            alt: [],
        }),
        hintContent: manager.build({
            key: 'hintContent',
            value: input.hintContent,
        }),
        hintTag: manager.buildOrFail({
            key: 'hintTag',
            value: input.hintTag,
            alt: 'div',
        }),

        class: manager.buildOrFail({
            key: 'class',
            value: input.class,
            alt: [],
        }),
        props: manager.buildOrFail({
            key: 'props',
            value: input.props,
            alt: {},
        }),

        label: manager.build({
            key: 'label',
            value: input.label,
        }),
        labelClass: manager.buildOrFail({
            key: 'labelClass',
            value: input.labelClass,
            alt: [],
        }),
        labelContent: manager.build({
            key: 'labelContent',
            value: input.labelContent,
        }),
        labelTag: manager.buildOrFail({
            key: 'labelTag',
            value: input.labelTag,
            alt: 'label',
        }),

        dirty: input.dirty ?? true,

        validation: manager.buildOrFail({
            key: 'validation',
            value: input.validation,
            alt: true,
        }),
        validationMessages: input.validationMessages || {},
        // errorClass
        validationErrorClass: manager.buildOrFail({
            key: 'validationErrorClass',
            value: input.validationErrorClass,
            alt: [],
        }),
        // warningClass
        validationWarningClass: manager.buildOrFail({
            key: 'validationWarningClass',
            value: input.validationWarningClass,
            alt: [],
        }),
    };
}

export function buildFormGroup(
    input: FormGroupOptionsInput,
) {
    const options = buildFormGroupOptions(input);

    const children : VNodeChild = [];

    let label : boolean;
    if (typeof options.label === 'boolean') {
        label = options.label;
    } else {
        label = !!options.labelContent || hasNormalizedSlot(SlotName.LABEL, options.slotItems);
    }

    if (label) {
        if (hasNormalizedSlot(SlotName.LABEL, options.slotItems)) {
            children.push(h(
                options.labelTag,
                { class: options.labelClass },
                [
                    normalizeSlot(SlotName.LABEL, {}, options.slotItems),
                ],
            ));
        } else if (options.labelContent) {
            children.push(
                h(
                    options.labelTag,
                    { class: options.labelClass },
                    [options.labelContent],
                ),
            );
        }
    }

    if (hasNormalizedSlot(SlotName.DEFAULT, options.slotItems)) {
        children.push(normalizeSlot(SlotName.DEFAULT, { }, options.slotItems));
    } else if (options.content) {
        children.push(options.content);
    }

    if (options.validation) {
        children.push(buildValidationGroup({
            dirty: options.dirty,
            slotItems: options.slotItems,
            validationMessages: options.validationMessages,
        }));
    }

    let hint : boolean;
    if (typeof options.hint === 'boolean') {
        hint = options.hint;
    } else {
        hint = !!options.hintContent || hasNormalizedSlot(SlotName.HINT, options.slotItems);
    }

    if (hint) {
        if (hasNormalizedSlot(SlotName.HINT, options.slotItems)) {
            children.push(h(
                options.hintTag,
                { class: options.hintClass },
                [
                    normalizeSlot(SlotName.HINT, {}, options.slotItems),
                ],
            ));
        } else if (options.hintContent) {
            children.push(h(options.hintTag, {
                class: options.hintClass,
            }, [
                options.hintContent,
            ]));
        }
    }

    let validationClass : VNodeClass | undefined;
    if (options.validation) {
        const isValidationInvalid = Object.keys(options.validationMessages).length > 0;
        if (isValidationInvalid) {
            if (options.dirty) {
                validationClass = options.validationErrorClass;
            } else {
                validationClass = options.validationWarningClass;
            }
        }
    }

    return h(
        'div',
        {
            class: [
                options.class,
                validationClass,
            ],
            ...options.props,
        },
        children,
    );
}
