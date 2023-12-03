/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { createOptionBuilder } from '@vue-layout/core';
import { Component } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
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

        options: options.options,
        optionDefault: buildOrFail({
            key: 'optionDefault',
            value: options.optionDefault,
            alt: true,
        }),
        optionDefaultId: buildOrFail({
            key: 'optionDefaultId',
            value: options.optionDefaultId,
            alt: '',
        }),
        optionDefaultValue: buildOrFail({
            key: 'optionDefaultValue',
            value: options.optionDefaultValue,
            alt: '-- Select --',
        }),
    };
}

export function buildFormSelect(
    input: FormSelectBuildOptionsInput,
) : VNodeChild {
    const options = buildFormSelectOptions(input);

    const rawValue = unref(options.value);

    const children : VNodeChild = [];
    if (options.optionDefault) {
        children.push(h('option', {
            value: options.optionDefaultId,
        }, [
            options.optionDefaultValue,
        ]));
    }

    for (let i = 0; i < options.options.length; i++) {
        children.push(h('option', {
            key: options.options[i].id,
            value: options.options[i].id,
            selected: options.options[i].id === rawValue,
        }, options.options[i].value));
    }

    return h(
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
    );
}
