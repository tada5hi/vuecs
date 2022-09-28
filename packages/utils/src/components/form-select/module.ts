/*
 * Copyright (c) 2022-2022.
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
import { FormSelectBuildOptions, FormSelectBuildOptionsInput, FormSelectOption } from './type';

export function buildFormSelectOptions(
    input: FormSelectBuildOptionsInput,
) : FormSelectBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormSelect, {
        class: {
            preset: {
                [Preset.BOOTSTRAP_V5]: {
                    value: ['form-select'],
                },
            },
        },
    });

    const { buildOrFail } = createOptionValueBuilder<FormSelectBuildOptions>(
        Component.FormSelect,
    );

    return {
        ...options,

        options: unref(options.options),
        optionDefaultText: buildOrFail({
            key: 'optionDefaultText',
            value: unref(options.optionDefaultText),
            alt: 'Select',
        }),
    };
}

export function buildFormSelect(
    input: FormSelectBuildOptionsInput,
) : VNode {
    const options = buildFormSelectOptions(input);

    const children : VNodeChild = [];

    if (options.label) {
        children.push(h('label', [options.labelContent]));
    }

    const rawValue = unref(options.value);

    return buildValidationGroup({
        content: [
            ...children,
            h(
                'select',
                mergeProps(
                    {
                        class: options.class,
                        onChange($event: any) {
                            const $$selectedVal = Array.prototype.filter.call($event.target.options, (o) => o.selected).map((o) => ('_value' in o ? o._value : o.value));
                            const value = $event.target.multiple ? $$selectedVal : $$selectedVal[0];

                            handleFormValueChanged(options, value);
                        },
                        ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
                    },
                    options.props,
                ),
                [
                    h('option', {
                        value: '',
                    }, ['-- ', options.optionDefaultText, ' --']),
                    options.options.map((item: FormSelectOption) => h('option', {
                        key: item.id,
                        value: item.id,
                    }, item.value)),
                ],
            ),
        ],
        validationResult: options.validationResult,
        validationMessages: options.validationMessages,
        validationTranslator: options.validationTranslator,
    });
}
