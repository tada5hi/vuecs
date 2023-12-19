import type { VNodeChild } from 'vue';
import { h, mergeProps, unref } from 'vue';
import { Component } from '../constants';
import { buildFormBaseOptions, handleFormValueChanged } from '../form-base';
import type { FormTextareaBuildOptions, FormTextareaBuildOptionsInput } from './type';

export function buildFormTextareaOptions(
    input: FormTextareaBuildOptionsInput,
) : FormTextareaBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormTextarea);

    return {
        ...options,
    };
}

export function buildFormTextarea(
    input: FormTextareaBuildOptionsInput,
) : VNodeChild {
    const options = buildFormTextareaOptions(input);

    const rawValue = unref(options.value);

    return h(
        'textarea',
        mergeProps(
            {
                placeholder: '...',
                class: options.class,
                onInput($event: any) {
                    if ($event.target.composing) {
                        return;
                    }

                    handleFormValueChanged(options, $event.target.value);
                },
                ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
            },
            options.props,
        ),
    );
}
