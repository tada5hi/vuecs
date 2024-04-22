export type ValidationResult<T = unknown> = {
    $model: T

    readonly $dirty: boolean
    readonly $error: boolean
    readonly $invalid: boolean
    readonly $anyDirty: boolean
    readonly $pending: boolean
    readonly $path: string

    [key: string]: any
};

export type ValidationMessagesRecordStyle = Record<string, string>;
export type ValidationMessagesArrayStyle = { key: string, value: string }[];

export type ValidationMessages = ValidationMessagesArrayStyle | ValidationMessagesRecordStyle;

// --------------------------------------

export type ListLoadMeta = {
    limit: number,
    offset: number,
    total: number,
    page: number
};

export type ListLoadFn = (data?: ListLoadMeta) => Promise<void> | void;
