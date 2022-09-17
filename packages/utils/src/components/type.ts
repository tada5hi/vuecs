/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Slots, VNode, VNodeChild } from 'vue';
import {
    MaybeRef, ToMaybeRef, VNodeClass, VNodeProperties,
} from '../type';
import { PaginationMeta } from './pagination';

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

export type OptionsInput<T,
    R extends keyof T = never,
    P extends keyof T = never,
    MR extends keyof T = never,
    > = Pick<T, R> &
    Partial<Pick<T, P>> &
    ToMaybeRef<Pick<T, MR>> &
    Partial<ToMaybeRef<Pick<T, Exclude<keyof T, R | P | MR>>>>;

// --------------------------------------

export type ListLoadFn = (data?: PaginationMeta) => Promise<void> | void;
export type ListBaseOptions = {
    slotItems: Slots,
    slotProps: Record<string, any>,

    tag: string,
    class: VNodeClass,
    props: VNodeProperties,
};
export type ListBaseOptionsInput = OptionsInput<ListBaseOptions, never, 'slotItems'>;

export type ExpectListBaseOptions<T extends ListBaseOptions | ListBaseOptionsInput,
    > = Omit<T, keyof ListBaseOptions | keyof ListBaseOptionsInput>;

// --------------------------------------

export type FormBaseOptions = {
    label: boolean,
    labelContent: string | VNode | (VNode | string)[] | VNodeChild,

    class: VNodeClass,
    props: VNodeProperties,

    value?: MaybeRef<unknown>,

    change?: (input: any) => void,
    validationResult: Partial<ValidationResult>,
    validationMessages: ValidationMessages,
    validationTranslator?: ValidationTranslator
};

export type FormBaseOptionsInput = OptionsInput<FormBaseOptions,
never,
'value' | 'change' | 'validationTranslator' | 'validationResult'>;

export type ExpectFormBaseOptions<T extends FormBaseOptions | FormBaseOptionsInput> =
    Omit<T, keyof FormBaseOptions | keyof FormBaseOptionsInput>;
