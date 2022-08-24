/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { h, unref } from 'vue';
import { BaseValidation } from '@vuelidate/core';
import {
    FormSubmitContext,
} from './type';

export function buildFormSubmit<
    T extends Record<string, any>,
>(
    context: FormSubmitContext,
) {
    const updateText = context.updateText || 'Update';
    const updateIcon = context.updateIconClass || 'fa fa-save';
    const updateButtonClass = context.updateButtonClass || 'btn btn-xs btn-primary';

    const createText = context.createText || 'Create';
    const createIcon = context.createIconClass || 'fa fa-plus';
    const createButtonClass = context.createButtonClass || 'btn btn-xs btn-success';

    const validation : Partial<BaseValidation> = context.validationGroup || {};

    return h('div', {
        staticClass: 'form-group',
    }, [
        h('button', {
            class: {
                [updateButtonClass]: unref(context.isEditing),
                [createButtonClass]: !unref(context.isEditing),
            },
            domProps: {
                disabled: validation.$invalid || unref(context.busy),
            },
            attrs: {
                disabled: validation.$invalid || context.busy,
                type: 'submit',
            },
            onClick($event: any) {
                $event.preventDefault();

                return context.submit.apply(null);
            },
        }, [
            h('i', {
                staticClass: 'pr-1',
                class: {
                    [updateIcon]: unref(context.isEditing),
                    [createIcon]: !unref(context.isEditing),
                },
            }),
            ' ',
            (
                unref(context.isEditing) ?
                    updateText :
                    createText
            ),
        ]),
    ]);
}
