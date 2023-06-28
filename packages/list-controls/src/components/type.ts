/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type ListMeta = {
    limit?: number,
    offset?: number,
    total?: number,
    page?: number,
    [key: string]: any
};

export type ListLoadFn = (data?: ListMeta) => Promise<void> | void;
export type ListEventFn<T> = (item: T) => any;
export type ListItemKey<T> = keyof T | ((item: T) => keyof T);
export type ListItemId<T> = (item: T) => string | number;
