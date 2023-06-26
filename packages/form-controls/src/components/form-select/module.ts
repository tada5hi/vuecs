/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { createOptionBuilder, failOnUndefined } from '@vue-layout/core';
import { Component } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import { buildValidationGroup } from '../validation-group';
import type { FormSelectBuildOptions, FormSelectBuildOptionsInput } from './type';

export function buildFormSelectOptions(
    input: FormSelectBuildOptionsInput,
) : FormSelectBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormSelect);

    const { buildOrFail } = createOptionBuilder<FormSelectBuildOptions>(
        Component.FormSelect,
    );

    return {
        ...options,

        options: failOnUndefined(unref(options.options)),
        optionDefaultText: buildOrFail({
            key: 'optionDefaultText',
            value: options.optionDefaultText,
            alt: 'Select',
        }),
        optionDefaultTextEnabled: buildOrFail({
            key: 'optionDefaultTextEnabled',
            value: options.optionDefaultTextEnabled,
            alt: true,
        }),
    };
}

export function buildFormSelect(
    input: FormSelectBuildOptionsInput,
) : VNode {
    const options = buildFormSelectOptions(input);

    const rawValue = unref(options.value);

    const children : VNodeChild = [];
    if (options.optionDefaultTextEnabled) {
        children.push(h('option', {
            value: '',
        }, [
            '-- ', options.optionDefaultText, ' --',
        ]));
    }

    for (let i = 0; i < options.options.length; i++) {
        children.push(h('option', {
            key: options.options[i].id,
            value: options.options[i].id,
        }, options.options[i].value));
    }

    return buildValidationGroup({
        content: [
            ...(options.label ?
                [h('label', { class: options.labelClass }, [options.labelContent])] :
                []
            ),
            h(
                'select',
                mergeProps(
                    {
                        class: options.class,
                        onChange($event: any) {
                            const $$selectedVal = Array.prototype.filter.call(
                                $event.target.options,
                                (o) => o.selected,
                            ).map((o) => ('_value' in o ? o._value : o.value));

                            const value = $event.target.multiple ? $$selectedVal : $$selectedVal[0];

                            handleFormValueChanged(options, value);
                        },
                        ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
                    },
                    options.props,
                ),
                children,
            ),
        ],
        hint: options.hint,
        validationResult: options.validationResult,
        validationMessages: options.validationMessages,
        validationTranslator: options.validationTranslator,
    });
}
