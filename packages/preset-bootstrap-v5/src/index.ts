export default {
    formGroup: {
        class: 'form-group',
        validationErrorClass: 'form-group-error',
        validationWarningClass: 'form-group-warning',
    },
    formInput: {
        class: 'form-control',
        labelClass: 'form-label',
        groupClass: 'input-group',
        groupAppendClass: 'input-group-text',
        groupPrependClass: 'input-group-text',
    },
    formInputText: {
        class: 'form-control',
        labelClass: 'form-label',
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
        class: 'form-select',
        labelClass: 'form-label',
    },
    formSubmit: {
        createButtonClass: 'btn btn-xs btn-success',
        updateButtonClass: 'btn btn-xs btn-primary',
    },
    formTextarea: {
        class: 'form-control',
        labelClass: 'form-label',
    },
    itemActionToggle: {
        disabledClass: 'btn btn-xs btn-dark',
        enabledClass: 'btn btn-xs btn-warning',
    },
    listActionRefresh: {
        class: 'btn btn-xs btn-dark',
    },
    list: {
        class: 'd-flex flex-column gap-1',
    },
    listBody: {
        class: 'list-unstyled m-0',
    },
    listItem: {
        class: 'd-flex flex-row align-items-center gap-1',
        actionsWrapperClass: 'ms-auto',
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

    navigation: {
        groupClass: 'nav-items',
        linkClass: 'nav-link',
    },

    pagination: {
        class: 'd-flex justify-content-center pagination',
    },
} as const;
