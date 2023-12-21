import { createComponentOptionsManager, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import { h } from 'vue';
import { Component, SlotName } from '../constants';
import { buildValidationGroup } from '../validation-group';
import type { FormGroupLabelSlotProps, FormGroupOptions, FormGroupOptionsInput } from './type';

export function buildFormGroupOptions(
    input: FormGroupOptionsInput,
) : FormGroupOptions {
    const manager = createComponentOptionsManager<FormGroupOptions>({
        name: Component.FormGroup,
    });

    return {
        ...input,

        slotItems: input.slotItems || {},

        hint: manager.buildOrFail({
            key: 'hint',
            value: input.hint,
            alt: undefined,
        }),
        hintClass: manager.buildOrFail({
            key: 'hintClass',
            value: input.hintClass,
            alt: [],
        }),
        hintContent: manager.buildOrFail({
            key: 'hintContent',
            value: input.hintContent,
            alt: '',
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

        label: manager.buildOrFail({
            key: 'label',
            value: input.label,
            alt: true,
        }),
        labelClass: manager.buildOrFail({
            key: 'labelClass',
            value: input.labelClass,
            alt: [],
        }),
        labelContent: manager.buildOrFail({
            key: 'labelContent',
            value: input.labelContent,
            alt: 'Input',
        }),

        validation: manager.buildOrFail({
            key: 'validation',
            value: input.validation,
            alt: true,
        }),
        validationMessages: input.validationMessages || {},
        validationResult: input.validationResult || {},
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

    if (options.label) {
        if (hasNormalizedSlot(SlotName.LABEL, options.slotItems)) {
            children.push(normalizeSlot(SlotName.LABEL, {
                class: options.class,
            } satisfies FormGroupLabelSlotProps, options.slotItems));
        } else {
            children.push(
                h(
                    'label',
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
            slotItems: options.slotItems,
            validationResult: options.validationResult,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        }));
    }

    if (options.hint && options.hintContent) {
        children.push(h('div', {
            class: options.hintClass,
        }, [
            options.hintContent,
        ]));
    }

    return h(
        'div',
        {
            class: [
                options.class,
                ...(
                    options.validationResult &&
                    options.validationResult.$invalid &&
                    options.validationResult.$dirty ?
                        [options.validationErrorClass] :
                        []
                ),
                ...(
                    options.validationResult &&
                    options.validationResult.$invalid &&
                    !options.validationResult.$dirty ?
                        [options.validationWarningClass] :
                        []
                ),
            ],
            ...options.props,
        },
        children,
    );
}
