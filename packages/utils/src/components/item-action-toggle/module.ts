/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeArrayChildren, h, unref,
} from 'vue';
import { ItemActionToggleOptions, ItemActionToggleOptionsInput } from './type';
import { unrefWithDefault } from '../../utils';
import { pushMaybeRefArrayValue, setMaybeRefValue, spliceMaybeRefArray } from '../utils';
import { MaybeRef } from '../../type';
import { Component, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';

export function buildItemActionToggleOptions<T>(
    options: ItemActionToggleOptionsInput<T>,
) : ItemActionToggleOptions<T> {
    return {
        ...options,

        type: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'type',
            value: unref(options.type),
            alt: 'button',
        }),
        class: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'class',
            value: unref(options.class),
            alt: [],
        }),

        disabledClass: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'disabledClass',
            value: unref(options.disabledClass),
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'btn-dark',
                },
            },
        }),
        enabledClass: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'enabledClass',
            value: unref(options.enabledClass),
            alt: [],
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'btn-warning',
                },
            },
        }),

        childType: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'childType',
            value: unref(options.childType),
            alt: 'i',
        }),
        childDisabledContent: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'childDisabledContent',
            value: unref(options.childDisabledContent),
            alt: [],
        }),
        childDisabledClass: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'childDisabledClass',
            value: unref(options.childDisabledClass),
            alt: [],
            library: {
                [Library.FONT_AWESOME]: {
                    value: 'fa fa-plus',
                },
            },
        }),
        childEnabledContent: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'childEnabledContent',
            value: unref(options.childEnabledContent),
            alt: [],
        }),
        childEnabledClass: buildOptionValueOrFail({
            component: Component.ItemActionToggle,
            key: 'childEnabledClass',
            value: unref(options.childEnabledClass),
            alt: [],
            library: {
                [Library.FONT_AWESOME]: {
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

            if (typeof options.toggle === 'function') {
                options.toggle(value);
            }

            if (Array.isArray(currentValue)) {
                const index = currentValue.indexOf(value);
                if (index === -1) {
                    pushMaybeRefArrayValue(options.currentValue as MaybeRef<T[]>, value);
                } else {
                    spliceMaybeRefArray(options.currentValue as MaybeRef<T[]>, index, 1);
                }

                return;
            }

            if (value === currentValue) {
                setMaybeRefValue(options.currentValue, null);

                return;
            }

            setMaybeRefValue(options.currentValue, value);
        },
    }, [
        children,
    ]);
}
