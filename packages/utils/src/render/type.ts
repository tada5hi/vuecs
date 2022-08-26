/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ToMaybeRef } from '../type';

export type ValidationTranslator = (input: string, parameters: Record<string, any>) => string | undefined;
export type ValidationMessages = Record<string, string>;

export type OptionsInput<T,
    R extends keyof T = never,
    P extends keyof T = never,
    MR extends keyof T = never,
    > = Pick<T, R> &
    Partial<Pick<T, P>> &
    ToMaybeRef<Pick<T, MR>> &
    Partial<ToMaybeRef<Pick<T, Exclude<keyof T, R | P | MR>>>>;
