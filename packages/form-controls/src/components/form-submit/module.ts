import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import {
    createComponentOptionsManager,
    isPromise,
    setMaybeRefValue,
    unrefWithDefault,
} from '@vuecs/core';
import { Component } from '../constants';
import type { FormSubmitOptions, FormSubmitOptionsInput } from './type';

export function buildFormSubmitOptions(
    options: FormSubmitOptionsInput,
) : FormSubmitOptions {
    const manager = createComponentOptionsManager<FormSubmitOptions>({
        name: Component.FormSubmit,
    });

    return {
        ...options,

        type: manager.buildOrFail({
            key: 'type',
            value: options.type,
            alt: 'button',
        }),
        class: manager.buildOrFail({
            key: 'class',
            value: options.class,
            alt: [],
        }),
        props: manager.buildOrFail({
            key: 'props',
            value: options.props,
            alt: {},
        }),

        icon: manager.buildOrFail({
            key: 'icon',
            value: options.icon,
            alt: true,
        }),

        validationResult: unrefWithDefault(options.validationResult, {}),

        updateText: manager.buildOrFail({
            key: 'updateText',
            value: options.updateText,
            alt: 'Update',
        }),
        updateIconClass: manager.buildOrFail({
            key: 'updateIconClass',
            value: options.updateIconClass,
            alt: [],
        }),
        updateButtonClass: manager.buildOrFail({
            key: 'updateButtonClass',
            value: options.updateButtonClass,
            alt: [],
        }),

        createText: manager.buildOrFail({
            key: 'createText',
            value: options.createText,
            alt: 'Create',
        }),
        createIconClass: manager.buildOrFail({
            key: 'createIconClass',
            value: options.createIconClass,
            alt: [],
        }),
        createButtonClass: manager.buildOrFail({
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
                        .finally(() => {
                            setMaybeRefValue(options.busy, false);
                        });
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
