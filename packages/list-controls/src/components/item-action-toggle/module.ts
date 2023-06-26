/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNode, VNodeArrayChildren } from 'vue';
import { h, unref } from 'vue';
import type { MaybeRef } from '@vue-layout/core';
import {
    createOptionBuilder,
    pushMaybeRefArrayValue,
    setMaybeRefValue,
    spliceMaybeRefArray,
} from '@vue-layout/core';
import type { ItemActionToggleOptions, ItemActionToggleOptionsInput } from './type';
import { Component } from '../constants';

export function buildItemActionToggleOptions<T>(
    options: ItemActionToggleOptionsInput<T>,
) : ItemActionToggleOptions<T> {
    const { buildOrFail } = createOptionBuilder<ItemActionToggleOptions<T>>(
        Component.ItemActionToggle,
    );

    return {
        ...options,

        type: buildOrFail({
            key: 'type',
            value: options.type,
            alt: 'button',
        }),
        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: [],
        }),

        disabledClass: buildOrFail({
            key: 'disabledClass',
            value: options.disabledClass,
            alt: [],
        }),
        enabledClass: buildOrFail({
            key: 'enabledClass',
            value: options.enabledClass,
            alt: [],
        }),

        childType: buildOrFail({
            key: 'childType',
            value: options.childType,
            alt: 'i',
        }),
        childDisabledContent: buildOrFail({
            key: 'childDisabledContent',
            value: options.childDisabledContent,
            alt: [],
        }),
        childDisabledClass: buildOrFail({
            key: 'childDisabledClass',
            value: options.childDisabledClass,
            alt: [],
        }),
        childEnabledContent: buildOrFail({
            key: 'childEnabledContent',
            value: options.childEnabledContent,
            alt: [],
        }),
        childEnabledClass: buildOrFail({
            key: 'childEnabledClass',
            value: options.childEnabledClass,
            alt: [],
        }),

        busy: options.busy ?? false,
    };
}

export function buildItemActionToggle<T>(
    input: ItemActionToggleOptionsInput<T>,
) : VNode {
    const options = buildItemActionToggleOptions(input);

    const { busy } = options;

    const currentValue = unref(options.currentValue);
    const value = unref(options.value);

    let children : VNodeArrayChildren = [];

    const childClass = currentValue === value ?
        options.childEnabledClass :
        options.childDisabledClass;

    const childContent = currentValue === value ?
        options.childEnabledContent :
        options.childDisabledContent;

    if (childClass || childContent) {
        children = [
            h(options.childType, {
                class: childClass,
            }, [
                childContent,
            ]),
        ];
    }

    return h(options.type, {
        ...(options.type === 'button' ? { type: 'button' } : {}),
        disabled: busy,
        class: [
            ...(options.class ? [options.class] : []),
            ...(options.disabledClass && currentValue !== value ? [options.disabledClass] : []),
            ...(options.enabledClass && currentValue === value ? [options.enabledClass] : []),
        ],
        onClick($event: any) {
            $event.preventDefault();

            if (Array.isArray(currentValue)) {
                const index = currentValue.indexOf(value);
                if (index === -1) {
                    pushMaybeRefArrayValue(options.currentValue as MaybeRef<T[]>, value);
                } else {
                    spliceMaybeRefArray(options.currentValue as MaybeRef<T[]>, index, 1);
                }

                if (
                    options.currentValue &&
                    options.onChange
                ) {
                    options.onChange(options.currentValue as T);
                }

                return;
            }

            const setValue = (v: T | T[] | null) => {
                setMaybeRefValue(options.currentValue, v);

                if (options.onChange) {
                    options.onChange(v);
                }
            };

            if (value === currentValue) {
                setValue(null);

                return;
            }

            setValue(value);
        },
    }, [
        children,
    ]);
}
