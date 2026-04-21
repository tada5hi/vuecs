import type { Theme } from '@vuecs/core';

export default function bootstrapV4Preset(): Theme {
    return {
        elements: {
            formGroup: {
                classes: {
                    root: 'form-group',
                    validationError: 'form-group-error',
                    validationWarning: 'form-group-warning',
                },
            },
            formInput: {
                classes: {
                    root: 'form-control',
                    group: 'input-group',
                    groupAppend: 'input-group-text',
                    groupPrepend: 'input-group-text',
                },
            },
            formInputCheckbox: {
                classes: {
                    root: 'form-check-input',
                    label: 'form-check-label',
                    group: 'form-check',
                },
            },
            formSelect: { classes: { root: 'form-control' } },
            formSubmit: {
                classes: {
                    createButton: 'btn btn-xs btn-success',
                    updateButton: 'btn btn-xs btn-primary',
                },
            },
            formTextarea: { classes: { root: 'form-control' } },
            listBody: { classes: { root: 'list-unstyled' } },
            listItem: {
                classes: {
                    root: 'd-flex flex-row align-items-center',
                    icon: 'pr-1',
                    actionsWrapper: 'ml-auto',
                },
            },
            listNoMore: { classes: { root: 'alert alert-warning alert-sm' } },
            pagination: { classes: { root: 'd-flex justify-content-center' } },
        },
    };
}
