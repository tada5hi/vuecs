/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    VNode, VNodeChild, h, unref,
} from 'vue';
import { FormGroup, FormGroupProperties } from '../static';
import {
    FormGroupProps,
    FormInputBuildOptions, FormInputBuildOptionsInput,
} from './type';
import { buildFormBaseOptions, handleFormValueChanged } from './utils';
import { unrefWithDefault } from '../../utils';

export function buildFormInputOptions(
    input: FormInputBuildOptionsInput,
) : FormInputBuildOptions {
    const options = buildFormBaseOptions(input);

    return {
        ...options,

        append: unrefWithDefault(options.append, false),
        appendTextContent: unrefWithDefault(options.appendTextContent, ''),

        prepend: unrefWithDefault(options.prepend, false),
        prependTextContent: unrefWithDefault(options.prependTextContent, ''),
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

    if (options.prepend) {
        inputGroupChildren.push(h(
            'div',
            {
                class: 'input-group-prepend',
            },
            [
                h('div', { class: 'input-group-text' }, [options.prependTextContent]),
            ],
        ));
    }

    const rawValue = unref(options.value);
    const rawValidationValue = unref(options.validationRulesResult.$model);

    inputGroupChildren.push(h(
        'input',
        {
            type: 'text',
            placeholder: '...',
            class: 'form-control',
            onInput($event: any) {
                if ($event.target.composing) {
                    return;
                }

                handleFormValueChanged(options, $event.target.value);
            },
            ...(typeof rawValue !== 'undefined' ? { value: rawValue } : {}),
            ...(typeof rawValidationValue !== 'undefined' ? { value: rawValidationValue } : {}),
            ...options.props,
        },
    ));

    if (options.append) {
        inputGroupChildren.push(h(
            'div',
            {
                class: 'input-group-append',
            },
            [
                h('div', { class: 'input-group-text' }, [options.appendTextContent]),
            ],
        ));
    }

    children.push(h(
        'div',
        {
            class: 'input-group',
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
            default: (props: FormGroupProps) => h(
                'div',
                {
                    class: {
                        'form-group': true,
                        'form-group-error': options.validationRulesResult.$error,
                        'form-group-warning': options.validationRulesResult.$invalid && !options.validationRulesResult.$dirty,
                    },
                },
                [
                    ...children,
                    props.errors.map((error) => h('div', {
                        class: 'form-group-hint group-required',
                    }, [error])),
                ],
            ),
        },
    );
}
