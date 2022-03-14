/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement } from 'vue';
import {
    ComponentFormComputed,
    ComponentFormData,
    ComponentFormMethods,
    ComponentFormVuelidate,
    FormSubmitOptions,
} from './type';

export function buildFormSubmit<T extends Record<string, any>>(
    instance: ComponentFormMethods<T> &
    Partial<ComponentFormComputed<T>> &
    ComponentFormData<T> &
    ComponentFormVuelidate<T>,
    h: CreateElement,
    options?: FormSubmitOptions,
) {
    options = options || {};

    const updateText = options.updateText || 'Update';
    const updateIcon = options.updateIconClass || 'fa fa-save';
    const updateButtonClass = options.updateButtonClass || 'btn btn-xs btn-primary';

    const createText = options.createText || 'Create';
    const createIcon = options.createIconClass || 'fa fa-plus';
    const createButtonClass = options.createButtonClass || 'btn btn-xs btn-success';

    const isEditing : boolean = typeof instance.isEditing === 'boolean' ?
        instance.isEditing :
        false;

    return h('div', {
        staticClass: 'form-group',
    }, [
        h('button', {
            class: {
                [updateButtonClass]: isEditing,
                [createButtonClass]: !isEditing,
            },
            domProps: {
                disabled: instance.$v.form.$invalid || instance.busy,
            },
            attrs: {
                disabled: instance.$v.form.$invalid || instance.busy,
                type: 'submit',
            },
            on: {
                click($event: any) {
                    $event.preventDefault();

                    return instance.submit.apply(null);
                },
            },
        }, [
            h('i', {
                staticClass: 'pr-1',
                class: {
                    [updateIcon]: isEditing,
                    [createIcon]: !isEditing,
                },
            }),
            ' ',
            (
                isEditing ?
                    updateText :
                    createText
            ),
        ]),
    ]);
}
