/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import {
    createOptionValueBuilderForComponent,
    extractValueFromOptionValueInput,
    isPromise,
    setMaybeRefValue,
    unrefWithDefault,
} from '@vue-layout/core';
import { Component } from '../constants';
import type { FormSubmitOptions, FormSubmitOptionsInput } from './type';

export function buildFormSubmitOptions(
    options: FormSubmitOptionsInput,
) : FormSubmitOptions {
    const { buildOrFail } = createOptionValueBuilderForComponent<FormSubmitOptions>(
        Component.FormSubmit,
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

        validationResult: unrefWithDefault(options.validationResult, {}),

        updateText: buildOrFail({
            key: 'updateText',
            value: unref(options.updateText),
            alt: 'Update',
        }),
        updateIconClass: buildOrFail({
            key: 'updateIconClass',
            value: unref(options.updateIconClass),
            alt: [],
        }),
        updateButtonClass: buildOrFail({
            key: 'updateButtonClass',
            value: unref(options.updateButtonClass),
            alt: [],
        }),

        createText: buildOrFail({
            key: 'createText',
            value: unref(options.createText),
            alt: 'Create',
        }),
        createIconClass: buildOrFail({
            key: 'createIconClass',
            value: unref(options.createIconClass),
            alt: [],
        }),
        createButtonClass: buildOrFail({
            key: 'createButtonClass',
            value: unref(options.createButtonClass),
            alt: [],
        }),

        busy: options.busy ?? false,
        valid: options.valid ?? true,
        isEditing: unrefWithDefault(extractValueFromOptionValueInput(options.isEditing), false),
    };
}

export function buildFormSubmit(input: FormSubmitOptionsInput) {
    const options = buildFormSubmitOptions(input);

    return h('div', {
        class: 'form-group',
    }, [
        h(options.type, {
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

                const promise = options.submit.apply(null);

                if (isPromise(promise)) {
                    promise
                        .then(() => setMaybeRefValue(options.busy, false))
                        .catch((e) => {
                            setMaybeRefValue(options.busy, false);
                            throw (e);
                        });
                }

                return promise;
            },
        }, [
            h('i', {
                class: [
                    ...(options.isEditing ? [options.updateIconClass] : []),
                    ...(!options.isEditing ? [options.createIconClass] : []),
                ],
            }),
            ' ',
            (
                options.isEditing ?
                    options.updateText :
                    options.createText
            ),
        ]),
    ]);
}
