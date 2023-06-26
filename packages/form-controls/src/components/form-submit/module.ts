/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    createOptionBuilder,
    isPromise,
    setMaybeRefValue,
    unrefWithDefault,
} from '@vue-layout/core';
import { Component } from '../constants';
import type { FormSubmitOptions, FormSubmitOptionsInput } from './type';

export function buildFormSubmitOptions(
    options: FormSubmitOptionsInput,
) : FormSubmitOptions {
    const { buildOrFail } = createOptionBuilder<FormSubmitOptions>(
        Component.FormSubmit,
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
        props: buildOrFail({
            key: 'props',
            value: options.props,
            alt: {},
        }),

        icon: buildOrFail({
            key: 'icon',
            value: options.icon,
            alt: true,
        }),

        validationResult: unrefWithDefault(options.validationResult, {}),

        updateText: buildOrFail({
            key: 'updateText',
            value: options.updateText,
            alt: 'Update',
        }),
        updateIconClass: buildOrFail({
            key: 'updateIconClass',
            value: options.updateIconClass,
            alt: [],
        }),
        updateButtonClass: buildOrFail({
            key: 'updateButtonClass',
            value: options.updateButtonClass,
            alt: [],
        }),

        createText: buildOrFail({
            key: 'createText',
            value: options.createText,
            alt: 'Create',
        }),
        createIconClass: buildOrFail({
            key: 'createIconClass',
            value: options.createIconClass,
            alt: [],
        }),
        createButtonClass: buildOrFail({
            key: 'createButtonClass',
            value: options.createButtonClass,
            alt: [],
        }),

        busy: options.busy ?? false,
        valid: options.valid ?? true,
        isEditing: options.isEditing ?? false,
    };
}

export function buildFormSubmit(input: FormSubmitOptionsInput) : VNodeChild {
    const options = buildFormSubmitOptions(input);

    let icon : VNodeArrayChildren = [];
    if (options.icon) {
        icon = [
            h('i', {
                class: [
                    ...(options.isEditing ? [options.updateIconClass] : []),
                    ...(!options.isEditing ? [options.createIconClass] : []),
                ],
            }),
        ];
    }

    return h(
        options.type,
        mergeProps({
            ...(options.type === 'button' ? { type: 'submit' } : {}),
            class: [
                ...(options.isEditing ? [options.updateButtonClass] : []),
                ...(!options.isEditing ? [options.createButtonClass] : []),
            ],
            disabled: options.validationResult.$invalid ||
                !options.valid ||
                unref(options.busy),
            onClick($event: any) {
                $event.preventDefault();

                setMaybeRefValue(options.busy, true);

                const promise = options.submit();

                if (isPromise(promise)) {
                    promise
                        .finally(() => setMaybeRefValue(options.busy, false));
                }

                return promise;
            },
        }, options.props),
        [
            icon,
            ' ',
            (
                options.isEditing ?
                    options.updateText :
                    options.createText
            ),
        ],
    );
}
