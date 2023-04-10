/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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

export interface ValidationRuleResultWithoutParams {
    readonly $message: string
    readonly $pending: boolean
    readonly $invalid: boolean
    readonly $response: any
}

export interface ValidationRuleResultWithParams<P extends object = object> extends ValidationRuleResultWithoutParams {
    readonly $params: P
}

export type ValidationTranslator = (input: string, parameters: Record<string, any>) => string | undefined;
export type ValidationMessages = Record<string, string>;

// --------------------------------------

export type ListLoadMeta = {
    limit: number,
    offset: number,
    total: number,
    page: number
};

export type ListLoadFn = (data?: ListLoadMeta) => Promise<void> | void;
