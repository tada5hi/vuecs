import {
    createComponentOptionsManager,
    setMaybeRefValue,
} from '@vuecs/core';
import { isReactive } from 'vue';
import type { Component } from '../constants';
import type {
    ExpectFormBaseOptions, FormBaseOptions, FormBaseOptionsDefaults, FormBaseOptionsInput,
} from './type';

export function buildFormBaseOptions<T extends FormBaseOptionsInput>(
    options: T,
    component: Component,
    defaults?: FormBaseOptionsDefaults,
): ExpectFormBaseOptions<T> & FormBaseOptions {
    defaults = defaults || {};

    const manager = createComponentOptionsManager<FormBaseOptions>({
        name: component,
    });

    return {
        ...options,

        slotItems: options.slotItems || {},

        class: manager.buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || '',
        }),
        props: manager.buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),
    };
}

export function handleFormValueChanged(options: FormBaseOptions, value: unknown) {
    if (typeof options.value !== 'undefined') {
        if (isReactive(options.value)) {
            options.value = value;
        } else {
            setMaybeRefValue(options.value, value);
        }
    }

    if (options.onChange) {
        options.onChange.call(null, value);
    }

    return options;
}
