/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ComponentsOptions } from '../type';

export const bootstrapV4 : ComponentsOptions = {
    formInput: {
        class: 'form-control',
        groupClass: 'input-group',
        groupAppendClass: 'input-group-text',
        groupPrependClass: 'input-group-text',
    },
    formInputText: {
        class: 'form-control',
        groupClass: 'input-group',
        groupAppendClass: 'input-group-text',
        groupPrependClass: 'input-group-text',
    },
    formInputCheckbox: {
        class: 'form-check-input',
        labelClass: 'form-check-label',
        groupClass: 'form-check',
    },
    formSelect: {
        class: 'form-control',
    },
    formSubmit: {
        createButtonClass: 'btn btn-xs btn-success',
        updateButtonClass: 'btn btn-xs btn-primary',
    },
    formTextarea: {
        class: 'form-control',
    },
    itemActionToggle: {
        disabledClass: 'btn btn-xs btn-dark',
        enabledClass: 'btn btn-xs btn-warning',
    },
    listActionRefresh: {
        class: 'btn btn-xs btn-dark',
    },
    listHeader: {
        class: 'd-flex flex-row align-items-center',
        actionClass: 'd-flex flex-row ml-auto',
    },
    listItem: {
        class: 'd-flex flex-row align-items-center',
        iconClass: 'pr-1',
    },
    listNoMore: {
        class: 'alert alert-warning alert-sm',
    },
    listPagination: {
        class: 'd-flex justify-content-center',
    },
    listTitle: {
        textClass: 'mb-0',
    },
    pagination: {
        class: 'd-flex justify-content-center',
    },
    validationGroup: {
        class: 'form-group',
        errorClass: 'form-group-error',
        warningClass: 'form-group-warning',
    },
};
