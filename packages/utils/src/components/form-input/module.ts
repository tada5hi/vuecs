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

        groupClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupClass',
            value: unref(options.groupClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
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
                    value: 'input-group-append',
                },
            },
        }),
        groupAppendTextClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupAppendTextClass',
            value: unref(options.groupAppendTextClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'input-group-text',
                },
            },
        }),
        groupAppendTextContent: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupAppendTextContent',
            value: unref(options.groupAppendTextContent),
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
                    value: 'input-group-prepend',
                },
            },
        }),
        groupPrependTextClass: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupPrependTextClass',
            value: unref(options.groupPrependTextClass),
            alt: '',
            library: {
                [Library.BOOTSTRAP]: {
                    value: 'input-group-text',
                },
            },
        }),
        groupPrependTextContent: buildOptionValueOrFail({
            component: Component.FormInput,
            key: 'groupPrependTextContent',
            value: unref(options.groupPrependTextContent),
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
        inputGroupChildren.push(h(
            'div',
            {
                class: options.groupPrependClass,
            },
            [
                h('div', { class: options.groupPrependTextClass }, [options.groupPrependTextContent]),
            ],
        ));
    }

    const rawValue = unref(options.value);
    const rawValidationValue = unref(options.validationRulesResult.$model);

    inputGroupChildren.push(h(
        'input',
        mergeProps(
            {
                type: 'text',
                placeholder: '...',
                class: options.class,
                onInput($event: any) {
                    if ($event.target.composing) {
                        return;
                    }

                    handleFormValueChanged(options, $event.target.value);
                },
                ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
                ...(typeof rawValidationValue !== 'undefined' ? { value: rawValidationValue } : {}),
            },
            options.props,
        ),
    ));

    if (options.groupAppend) {
        inputGroupChildren.push(h(
            'div',
            {
                class: options.groupAppendClass,
            },
            [
                h('div', { class: options.groupAppendTextClass }, [options.groupAppendTextContent]),
            ],
        ));
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
            validations: options.validationRulesResult,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        } as FormGroupProperties,
        {
            default: () => children,
        },
    );
}
