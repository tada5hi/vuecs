/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import { isPromise, unrefWithDefault } from '../../utils';
import { setMaybeRefValue } from '../utils';
import {
    FormSubmitOptions,
    FormSubmitOptionsInput,
} from './type';

export function buildFormSubmitOptions(
    options: FormSubmitOptionsInput,
) : FormSubmitOptions {
    return {
        ...options,

        validationRulesResult: unrefWithDefault(options.validationRulesResult, {}),

        updateText: unrefWithDefault(options.updateText, 'Update'),
        updateIconClass: unrefWithDefault(options.updateIconClass, 'fa fa-save'),
        updateButtonClass: unrefWithDefault(options.updateButtonClass, 'btn btn-xs btn-primary'),

        createText: unrefWithDefault(options.updateText, 'Create'),
        createIconClass: unrefWithDefault(options.updateIconClass, 'fa fa-plus'),
        createButtonClass: unrefWithDefault(options.updateButtonClass, 'btn btn-xs btn-success'),

        busy: options.busy ?? false,
        isEditing: unrefWithDefault(options.isEditing, false),
    };
}

export function buildFormSubmit(input: FormSubmitOptionsInput) {
    const options = buildFormSubmitOptions(input);

    return h('div', {
        class: 'form-group',
    }, [
        h('button', {
            class: {
                [options.updateButtonClass]: options.isEditing,
                [options.createButtonClass]: !options.isEditing,
            },
            disabled: options.validationRulesResult.$invalid || unref(options.busy),
            type: 'submit',
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
                    'pr-1',
                    {
                        [options.updateIconClass]: options.isEditing,
                        [options.createIconClass]: !options.isEditing,
                    },
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
