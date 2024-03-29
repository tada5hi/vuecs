import type { VNodeChild } from 'vue';
import {
    h, mergeProps, unref,
} from 'vue';
import { createComponentOptionsManager, hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import { Component, SlotName } from '../constants';
import type { FormBaseOptions } from '../form-base';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import type { FormInputCheckboxBuildOptions, FormInputCheckboxBuildOptionsInput, FormInputCheckboxLabelSlotProps } from './type';

export function buildFormInputCheckboxOptions(
    input: FormInputCheckboxBuildOptionsInput,
) : FormInputCheckboxBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormInputCheckbox);

    const manager = createComponentOptionsManager<FormInputCheckboxBuildOptions>({
        name: Component.FormInputCheckbox,
    });

    return {
        ...options,

        group: manager.buildOrFail({
            key: 'group',
            value: options.group,
            alt: false,
        }),
        groupClass: manager.buildOrFail({
            key: 'groupClass',
            value: unref(options.groupClass),
            alt: '',
        }),

        label: manager.buildOrFail({
            key: 'label',
            value: options.label,
            alt: true,
        }),
        labelClass: manager.buildOrFail({
            key: 'labelClass',
            value: options.labelClass,
            alt: [],
        }),
        labelContent: manager.buildOrFail({
            key: 'labelContent',
            value: options.labelContent,
            alt: 'Input',
        }),
    };
}

export function buildFormInputCheckbox(
    input: FormInputCheckboxBuildOptionsInput,
) : VNodeChild {
    const options = buildFormInputCheckboxOptions(input);

    const id = (Math.random() + 1).toString(36).substring(7);

    const rawValue = unref(options.value);

    let isChecked : boolean | undefined;
    let index : number = -1;

    if (typeof rawValue !== 'undefined') {
        if (Array.isArray(rawValue)) {
            if (typeof options.props.value !== 'undefined') {
                index = rawValue.indexOf(options.props.value);
                isChecked = index !== -1;
            }
        } else {
            isChecked = !!rawValue;
        }
    }

    const element = h(
        'input',
        mergeProps(
            {
                id,
                type: 'checkbox',
                class: options.class,
                onInput($event: any) {
                    if ($event.target.composing) {
                        return;
                    }

                    if (Array.isArray(rawValue)) {
                        if (typeof options.props.value !== 'undefined') {
                            if (index === -1) {
                                rawValue.push(options.props.value);
                            } else {
                                rawValue.splice(index, 1);
                            }
                        }

                        handleFormValueChanged(options, rawValue);
                    } else {
                        handleFormValueChanged(options, !rawValue);
                    }
                },
                ...(typeof isChecked === 'boolean' ? { checked: isChecked } : {}),
            },
            options.props,
        ),
    );

    if (options.label || options.group) {
        const children: VNodeChild[] = [];

        if (options.label) {
            if (hasNormalizedSlot(SlotName.LABEL, options.slotItems)) {
                children.push(normalizeSlot(SlotName.LABEL, {
                    class: options.class,
                    id,
                } satisfies FormInputCheckboxLabelSlotProps, options.slotItems));
            } else {
                children.push(h(
                    'label',
                    {
                        class: options.labelClass,
                        for: id,
                    },
                    [options.labelContent],
                ));
            }
        }

        children.push(element);

        return h(
            'div',
            {
                class: options.groupClass,
            },
            children,
        );
    }

    return element;
}
