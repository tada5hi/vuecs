/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum Component {
    FormGroup = 'formGroup',
    FormInput = 'formInput',
    FormInputCheckbox = 'formInputCheckbox',
    FormInputText = 'formInputText',
    FormSelect = 'formSelect',
    FormSubmit = 'formSubmit',
    FormTextarea = 'formTextarea',
}

export enum SlotName {
    DEFAULT = 'default',
    LABEL = 'label',
    VALIDATION_GROUP = 'validationGroup',
    VALIDATION_ITEM = 'validationItem',
}
