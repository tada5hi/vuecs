import type { Theme } from '@vuecs/core';

export default function bootstrapV5Preset(): Theme {
    return {
        elements: {
            formGroup: {
                root: 'form-group',
                label: 'form-label',
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
            formSelect: { root: 'form-select' },
            formSubmit: {
                createButton: 'btn btn-xs btn-success',
                updateButton: 'btn btn-xs btn-primary',
            },
            formTextarea: { root: 'form-control' },
            list: { root: 'd-flex flex-column gap-1' },
            listBody: { root: 'list-unstyled m-0' },
            listItem: {
                root: 'd-flex flex-row align-items-center gap-1',
                actionsWrapper: 'ms-auto',
            },
            listNoMore: { root: 'alert alert-warning alert-sm' },
            navigation: {
                group: 'nav-items',
                link: 'nav-link',
            },
            pagination: { root: 'd-flex justify-content-center pagination' },
        },
    };
}
