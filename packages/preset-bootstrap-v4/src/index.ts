import type { Theme } from '@vuecs/core';

export default function bootstrapV4Preset(): Theme {
    return {
        elements: {
            formGroup: {
                root: 'form-group',
                validationError: 'form-group-error',
                validationWarning: 'form-group-warning',
            },
            formInput: {
                root: 'form-control',
                group: 'input-group',
                groupAppend: 'input-group-text',
                groupPrepend: 'input-group-text',
            },
            formInputCheckbox: {
                root: 'form-check-input',
                label: 'form-check-label',
                group: 'form-check',
            },
            formSelect: { root: 'form-control' },
            formSubmit: {
                createButton: 'btn btn-xs btn-success',
                updateButton: 'btn btn-xs btn-primary',
            },
            formTextarea: { root: 'form-control' },
            listBody: { root: 'list-unstyled' },
            listItem: {
                root: 'd-flex flex-row align-items-center',
                icon: 'pr-1',
                actionsWrapper: 'ml-auto',
            },
            listNoMore: { root: 'alert alert-warning alert-sm' },
            pagination: { root: 'd-flex justify-content-center' },
        },
    };
}
