/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { VNode, VNodeChild, h } from 'vue';
import { FormGroup, FormGroupProperties } from '../../components';
import {
    FormGroupProps,
    FormInputBuildOptions, FormInputBuildOptionsInput,
} from './type';
import { buildFormBaseOptions } from './utils';
import { unrefWithDefault } from '../../utils';

export function buildFormInputOptions(
    input: FormInputBuildOptionsInput,
) : FormInputBuildOptions {
    const options = buildFormBaseOptions(input);

    return {
        ...options,

        append: unrefWithDefault(options.append, false),
        appendTextContent: options.appendTextContent || '',

        prepend: unrefWithDefault(options.prepend, false),
        prependTextContent: options.prependTextContent || '',
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

    inputGroupChildren.push(h(
        'input',
        {
            type: 'text',
            placeholder: '...',
            value: options.validationRules.$model,
            class: 'form-control',
            onInput($event: any) {
                if ($event.target.composing) {
                    return;
                }

                options.validationRules.$model = $event.target.value;
                this.$emit('update:modelValue', $event.target.value);

                if (options.changeCallback) {
                    options.changeCallback.call(null, $event.target.value);
                }
            },
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
            validations: options.validationRules,
            validationMessages: options.validationMessages,
            validationTranslator: options.validationTranslator,
        } as FormGroupProperties,
        {
            default: (props: FormGroupProps) => h(
                'div',
                {
                    class: {
                        'form-group': true,
                        'form-group-error': options.validationRules.$error,
                        'form-group-warning': options.validationRules.$invalid && !options.validationRules.$dirty,
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
