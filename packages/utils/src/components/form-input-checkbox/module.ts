/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeChild, h, mergeProps, unref,
} from 'vue';
import { Preset, createOptionValueBuilder } from '@vue-layout/core';
import { Component } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import { buildValidationGroup } from '../validation-group';
import { FormInputCheckboxBuildOptions, FormInputCheckboxBuildOptionsInput } from './type';

export function buildFormInputCheckboxOptions(
    input: FormInputCheckboxBuildOptionsInput,
) : FormInputCheckboxBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormInputCheckbox, {
        class: {
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: ['form-check-input'],
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: ['form-check-input'],
                },
            },
        },
        labelClass: {
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: ['form-check-label'],
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: ['form-check-label'],
                },
            },
        },
    });

    const { buildOrFail } = createOptionValueBuilder<FormInputCheckboxBuildOptions>(
        Component.FormInputCheckbox,
    );

    return {
        ...options,

        groupClass: buildOrFail({
            key: 'groupClass',
            value: unref(options.groupClass),
            alt: '',
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'form-check',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'form-check',
                },
            },
        }),
    };
}

export function buildFormInputCheckbox(
    input: FormInputCheckboxBuildOptionsInput,
) : VNode {
    const options = buildFormInputCheckboxOptions(input);

    const children : VNodeChild = [];

    const id = (Math.random() + 1).toString(36).substring(7);

    const rawValue = unref(options.value);
    children.push(h(
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

                    handleFormValueChanged(options, !rawValue);
                },
                ...(typeof rawValue !== 'undefined' ? { checked: rawValue } : {}),
            },
            options.props,
        ),
    ));

    if (options.label) {
        children.push(h('label', { class: options.labelClass, for: id }, [options.labelContent]));
    }

    return buildValidationGroup({
        content: h(
            'div',
            {
                class: options.groupClass,
            },
            children,
        ),
        validationResult: options.validationResult,
        validationMessages: options.validationMessages,
        validationTranslator: options.validationTranslator,
    });
}
