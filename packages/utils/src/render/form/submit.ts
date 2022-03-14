/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CreateElement } from 'vue';
import { hasOwnProperty } from '../../utils';
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
    const updateIcon = options.updateIcon || 'fa fa-save';

    const createText = options.createText || 'Create';
    const createIcon = options.createIcon || 'fa fa-plus';

    const isEditing : boolean = typeof instance.isEditing === 'boolean' ?
        instance.isEditing :
        false;

    return h('div', {
        staticClass: 'form-group',
    }, [
        h('button', {
            staticClass: 'btn btn-xs',
            class: {
                'btn-primary': isEditing,
                'btn-success': !isEditing,
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
