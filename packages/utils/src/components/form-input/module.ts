/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeChild, h, mergeProps, unref,
} from 'vue';
import { FormGroup, FormGroupProperties } from '../form-group';
import { buildFormBaseOptions, handleFormValueChanged } from '../utils';
import { FormInputBuildOptions, FormInputBuildOptionsInput } from './type';
import { Component, buildOptionValueOrFail } from '../../options';
import { Library } from '../../constants';

export function buildFormInputOptions(
    input: FormInputBuildOptionsInput,
) : FormInputBuildOptions {
    const options = buildFormBaseOptions(input, Component.FormInput);

    return {
        ...options,

        type: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'type',
            value: unref(options.type),
            alt: 'text',
        }),

        groupClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupClass',
            value: unref(options.groupClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'input-group',
                },
                [Library.BOOTSTRAP_V5]: {
                    value: 'input-group',
                },
            },
        }),

        groupAppend: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupAppend',
            value: unref(options.groupAppend),
            alt: false,
        }),
        groupAppendClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupAppendClass',
            value: unref(options.groupAppendClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'input-group-text',
                },
                [Library.BOOTSTRAP_V5]: {
                    value: 'input-group-text',
                },
            },
        }),
        groupAppendContent: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupAppendContent',
            value: unref(options.groupAppendContent),
            alt: '',
        }),

        groupPrepend: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupPrepend',
            value: unref(options.groupPrepend),
            alt: false,

        }),
        groupPrependClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupPrependClass',
            value: unref(options.groupPrependClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'input-group-text',
                },
                [Library.BOOTSTRAP_V5]: {
                    value: 'input-group-text',
                },
            },
        }),
        groupPrependContent: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupPrependContent',
            value: unref(options.groupPrependContent),
            alt: '',
        }),
    };
}

export function buildFormInput(
    input: FormInputBuildOptionsInput,
) : VNode {
    const options = buildFormInputOptions(input);

    const children : VNodeChild = [];

    if (options.label) {
        children.push(h('label', [options.labelContent]));
    }

    const inputGroupChildren : VNodeChild = [];

    if (options.groupPrepend) {
        inputGroupChildren.push(
            h('span', { class: options.groupPrependClass }, [options.groupPrependContent]),
        );
    }

    const rawValue = unref(options.value);

    inputGroupChildren.push(h(
        'input',
        mergeProps(
            {
                type: options.type,
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
    ));

    if (options.groupAppend) {
        inputGroupChildren.push(
            h('span', { class: options.groupAppendClass }, [options.groupAppendContent]),
        );
    }

    children.push(h(
        'div',
        {
            class: options.groupClass,
        },
        inputGroupChildren,
    ));

    return h(
        FormGroup,
        {
            validationResult: options.validationResult,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        } as FormGroupProperties,
        {
            default: () => children,
        },
    );
}
