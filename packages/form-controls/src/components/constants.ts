export enum Component {
    FormGroup = 'formGroup',
    FormInput = 'formInput',
    FormInputCheckbox = 'formInputCheckbox',
    FormInputText = 'formInputText',
    FormSelect = 'formSelect',
    FormSubmit = 'formSubmit',
    FormTextarea = 'formTextarea',
    VALIDATION_GROUP = 'validationGroup',
}

export enum SlotName {
    DEFAULT = 'default',
    LABEL = 'label',
    HINT = 'hint',

    GROUP_APPEND = 'groupAppend',
    GROUP_PREPEND = 'groupPrepend',

    VALIDATION_GROUP = 'validationGroup',
    VALIDATION_ITEM = 'validationItem',
}

export enum ValidationSeverity {
    ERROR = 'error',
    WARNING = 'warning',
}
