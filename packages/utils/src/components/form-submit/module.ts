/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import { isPromise, setMaybeRefValue, unrefWithDefault } from '../../utils';
import { Component } from '../constants';
import { FormSubmitOptions, FormSubmitOptionsInput } from './type';
import { createOptionValueBuilder } from '../../options';
import { Preset } from '../../constants';

export function buildFormSubmitOptions(
    options: FormSubmitOptionsInput,
) : FormSubmitOptions {
    const { buildOrFail } = createOptionValueBuilder<FormSubmitOptions>(
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
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-save',
                },
            },
        }),
        updateButtonClass: buildOrFail({
            key: 'updateButtonClass',
            value: unref(options.updateButtonClass),
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'btn btn-xs btn-primary',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'btn btn-xs btn-primary',
                },
            },
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
            preset: {
                [Preset.FONT_AWESOME]: {
                    value: 'fa fa-plus',
                },
            },
        }),
        createButtonClass: buildOrFail({
            key: 'createButtonClass',
            value: unref(options.createButtonClass),
            alt: [],
            preset: {
                [Preset.BOOTSTRAP]: {
                    value: 'btn btn-xs btn-success',
                },
                [Preset.BOOTSTRAP_V5]: {
                    value: 'btn btn-xs btn-success',
                },
            },
        }),

        busy: options.busy ?? false,
        valid: options.valid ?? true,
        isEditing: unrefWithDefault(options.isEditing, false),
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
