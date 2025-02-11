import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { createComponentOptionsManager, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import { Component, SlotName } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import type { FormInputBuildOptions, FormInputBuildOptionsInput } from './type';

export function buildFormInputOptions(
    input: FormInputBuildOptionsInput,
    component?: Component.FormInput | Component.FormInputText,
) : FormInputBuildOptions {
    component = component || Component.FormInput;
    const options = buildFormBaseOptions(input, component);

    const manager = createComponentOptionsManager<FormInputBuildOptions>({
        name: component,
    });

    return {
        ...options,

        slotItems: input.slotItems || {},

        type: manager.buildOrFail({
            key: 'type',
            value: options.type,
            alt: 'text',
        }),

        group: manager.buildOrFail({
            key: 'group',
            value: options.group,
            alt: false,
        }),
        groupClass: manager.buildOrFail({
            key: 'groupClass',
            value: options.groupClass,
            alt: [],
        }),

        groupAppend: manager.buildOrFail({
            key: 'groupAppend',
            value: options.groupAppend,
            alt: false,
        }),
        groupAppendClass: manager.build({
            key: 'groupAppendClass',
            value: options.groupAppendClass,
            alt: '',
        }),
        groupAppendContent: manager.build({
            key: 'groupAppendContent',
            value: options.groupAppendContent,
            alt: '',
        }),

        groupPrepend: manager.buildOrFail({
            key: 'groupPrepend',
            value: options.groupPrepend,
            alt: false,

        }),
        groupPrependClass: manager.build({
            key: 'groupPrependClass',
            value: options.groupPrependClass,
            alt: '',
        }),
        groupPrependContent: manager.build({
            key: 'groupPrependContent',
            value: options.groupPrependContent,
            alt: '',
        }),
    };
}

export function buildFormInput(
    input: FormInputBuildOptionsInput,
) : VNodeChild {
    const options = buildFormInputOptions(input);

    return buildFormInputFromOptions(options);
}

export function buildFormInputFromOptions(
    options: FormInputBuildOptions,
): VNodeChild {
    const children : VNodeChild = [];

    if (hasNormalizedSlot(SlotName.GROUP_PREPEND)) {
        children.push(
            h(
                'span',
                { class: options.groupPrependClass },
                [
                    normalizeSlot(SlotName.GROUP_PREPEND, {}, options.slotItems),
                ],
            ),
        );
    } else if (options.groupPrepend) {
        children.push(
            h(
                'span',
                { class: options.groupPrependClass },
                [
                    options.groupPrependContent,
                ],
            ),
        );
    }

    const rawValue = unref(options.value);

    children.push(h(
        'input',
        mergeProps(
            {
                type: options.type,
                class: options.class,
                onInput($event: any) {
                    if ($event.target.composing) {
                        return;
                    }

                    handleFormValueChanged(options, $event.target.value);
                },
                ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
            },
            options.props,
        ),
    ));

    if (hasNormalizedSlot(SlotName.GROUP_APPEND)) {
        children.push(
            h(
                'span',
                { class: options.groupAppendClass },
                [
                    normalizeSlot(SlotName.GROUP_APPEND, {}, options.slotItems),
                ],
            ),
        );
    } else if (options.groupAppend) {
        children.push(
            h(
                'span',
                {
                    class: options.groupAppendClass,
                },
                [
                    options.groupAppendContent,
                ],
            ),
        );
    }

    if (
        children.length > 1 ||
        options.group
    ) {
        return h(
            'div',
            {
                class: options.groupClass,
            },
            children,
        );
    }

    return children[0];
}
