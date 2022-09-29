/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h, unref,
} from 'vue';
import {
    MaybeRef, Preset, createOptionValueBuilder, pushMaybeRefArrayValue,
    setMaybeRefValue, spliceMaybeRefArray, unrefWithDefault,
} from '@vue-layout/core';
import { ItemActionToggleOptions, ItemActionToggleOptionsInput } from './type';
import { Component } from '../constants';

export function buildItemActionToggleOptions<T>(
    options: ItemActionToggleOptionsInput<T>,
) : ItemActionToggleOptions<T> {
    const { buildOrFail } = createOptionValueBuilder<ItemActionToggleOptions<T>>(
        Component.ItemActionToggle,
    );

    return {
        ...options,

        type: buildOrFail({
            key: 'type',
            value: unref(options.type),
            alt: 'button',
        }),
        class: buildOrFail({
            key: 'class',
            value: unref(options.class),
            alt: [],
        }),

        disabledClass: buildOrFail({
            key: 'disabledClass',
            value: unref(options.disabledClass),
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'btn btn-xs btn-dark',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'btn btn-xs btn-dark',
                },
            },
        }),
        enabledClass: buildOrFail({
            key: 'enabledClass',
            value: unref(options.enabledClass),
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'btn btn-xs btn-warning',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'btn btn-xs btn-warning',
                },
            },
        }),

        childType: buildOrFail({
            key: 'childType',
            value: unref(options.childType),
            alt: 'i',
        }),
        childDisabledContent: buildOrFail({
            key: 'childDisabledContent',
            value: unref(options.childDisabledContent),
            alt: [],
        }),
        childDisabledClass: buildOrFail({
            key: 'childDisabledClass',
            value: unref(options.childDisabledClass),
            alt: [],
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-plus',
                },
            },
        }),
        childEnabledContent: buildOrFail({
            key: 'childEnabledContent',
            value: unref(options.childEnabledContent),
            alt: [],
        }),
        childEnabledClass: buildOrFail({
            key: 'childEnabledClass',
            value: unref(options.childEnabledClass),
            alt: [],
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-minus',
                },
            },
        }),

        busy: unrefWithDefault(options.busy, false),
    };
}

export function buildItemActionToggle<T>(
    input: ItemActionToggleOptionsInput<T>,
) : VNode {
    const options = buildItemActionToggleOptions(input);

    const busy = unrefWithDefault(options.busy, false);
    const value = unref(options.value);
    const currentValue = unref(options.currentValue);

    let children : VNodeArrayChildren = [];

    const childClass = value === currentValue ?
        options.childEnabledClass :
        options.childDisabledClass;

    const childContent = value === currentValue ?
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
            ...(options.disabledClass && value !== currentValue ? [options.disabledClass] : []),
            ...(options.enabledClass && value === currentValue ? [options.enabledClass] : []),
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

            const setValue = (value: T | T[] | null) => {
                setMaybeRefValue(options.currentValue, value);
                if (options.onChange) {
                    options.onChange(value);
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
