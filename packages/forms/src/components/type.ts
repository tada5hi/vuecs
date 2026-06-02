export type ValidationResult<T = unknown> = {
    $model: T;

    readonly $dirty: boolean;
    readonly $error: boolean;
    readonly $invalid: boolean;
    readonly $anyDirty: boolean;
    readonly $pending: boolean;
    readonly $path: string;

    [key: string]: any;
};

export type ValidationMessagesRecordStyle = Record<string, string>;
export type ValidationMessagesArrayStyle = { key: string; value: string }[];

export type ValidationMessages = ValidationMessagesArrayStyle | ValidationMessagesRecordStyle;

/**
 * Single-prop bundle a `<VCFormGroup>` host consumes via `:validation`.
 *
 * Structurally identical to `@ilingo/validup-vue`'s exported
 * `FieldValidation` (and the return shape of `useFieldValidation`), so
 * the canonical bridge usage —
 * `<VCFormGroup :validation="useFieldValidation($v.fields.email)">` —
 * type-checks without either package importing the other (cross-package
 * structural compatibility; vuecs stays neutral about validation
 * libraries).
 *
 * `severity` accepts `'success'` for forward compatibility with
 * validation bridges that surface a "passed" state; vuecs currently
 * renders no class for it (the `:validation-success` theme slot is not
 * yet defined), so `'success'` behaves like `undefined` at the DOM
 * level. `error` and `warning` apply the matching `validationError` /
 * `validationWarning` theme class on the root.
 *
 * `messages` is array-style only (the `{ key, value }[]` shape vuecs
 * already renders inside `<VCValidationGroup>`). Producers using the
 * legacy record shape (`Record<string, string>`) keep using
 * `:validation-messages` directly.
 */
export type FieldValidation = {
    severity?: 'error' | 'warning' | 'success';
    messages: ValidationMessagesArrayStyle;
};
