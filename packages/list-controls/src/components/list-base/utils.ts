/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    createOptionBuilder,
    extendMaybeRefArrayValue,
    extendMaybeRefObject,
    findIndexOfMaybeRefArray,
    hasOwnProperty, isObject,
    isPromise,
    pushMaybeRefArrayValue,
    spliceMaybeRefArray,
} from '@vue-layout/core';
import { isRef, unref } from 'vue';
import type { MaybeRef } from 'vue';
import type { Component } from '../constants';
import type {
    ListItemId,
    ListItemKey,
} from '../type';
import type {
    ListBaseOptions, ListBaseOptionsDefaults, ListBaseOptionsInput, ListBaseSlotProps,
} from './type';

type Entity<T extends ListBaseOptionsInput<any, any>> = T extends ListBaseOptionsInput<infer U, any> ? U : never;
type Meta<T extends ListBaseOptionsInput<any, any>> = T extends ListBaseOptionsInput<any, infer U> ? U : never;
export function buildListBaseOptions<
    T extends ListBaseOptionsInput<any, any>,
    M = Meta<T>,
>(
    options: T,
    component: Component,
    defaults?: ListBaseOptionsDefaults<Entity<T>, M>,
): ListBaseOptions<Entity<T>, M> {
    defaults = defaults || {};

    const { buildOrFail } = createOptionBuilder<ListBaseOptions<Entity<T>, M>>(
        component,
    );

    return {
        slotItems: options.slotItems || {},
        slotProps: buildOrFail({
            key: 'slotProps',
            value: options.slotProps,
            alt: defaults.slotProps || {},
        }),
        slotPropsBuilt: options.slotPropsBuilt,

        tag: buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: defaults.tag || 'div',
        }),
        class: buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || [],
        }),
        props: buildOrFail({
            key: 'props',
            value: options.props,
            alt: defaults.props || {},
        }),

        total: options.total,
        load: options.load,
        meta: (options.meta || {}) as M,
        busy: options.busy,

        itemId: options.itemId,
        itemKey: options.itemKey,

        onCreated: options.onCreated,
        onUpdated: options.onUpdated,
        onDeleted: options.onDeleted,
    };
}

type ListBaseSlotPropsBuildContext<T, M> = Pick<
ListBaseOptions<T, M>,
'meta' |
'total' |
'busy' |
'load' |
'onUpdated' |
'onCreated' |
'onDeleted' |
'itemKey' |
'itemId'
> & {
    data?: MaybeRef<T | T[]>,
    [key: string]: any
};

type FilterFn<T> = (item: T, index?: number) => boolean;
const buildFilterFn = <T>(
    item: T,
    itemId?: ListItemId<T>,
    itemKey?: ListItemKey<T>,
) : FilterFn<T> | undefined => {
    let filterFn : FilterFn<T> | undefined;
    if (itemId) {
        filterFn = (el) => itemId(el) === itemId(item);
    }

    if (itemKey) {
        filterFn = (el) => {
            if (typeof itemKey === 'function') {
                return el[itemKey(el)] === item[itemKey(item)];
            }

            return el[itemKey] === item[itemKey];
        };
    }

    if (
        !filterFn &&
        isObject(item) &&
        hasOwnProperty(item, 'id')
    ) {
        filterFn = (el) => el['id' as keyof T] === item['id' as keyof T];
    }

    return filterFn;
};
export function buildListBaseSlotProps<T, M = any>(
    ctx: ListBaseSlotPropsBuildContext<T, M>,
) : ListBaseSlotProps<T, M> {
    const props : ListBaseSlotProps<T, M> = {};

    if (typeof ctx.busy !== 'undefined') {
        props.busy = unref(ctx.busy);
    }

    if (typeof ctx.meta !== 'undefined') {
        props.meta = ctx.meta;
    }

    if (typeof ctx.total !== 'undefined') {
        props.total = unref(ctx.total);
    }

    if (typeof ctx.load === 'function') {
        props.load = (meta) => {
            if (!isRef(ctx.busy)) {
                return ctx.load!(meta);
            }

            ctx.busy.value = true;

            const output = ctx.load!(meta);
            if (isPromise(output)) {
                return output.finally(() => {
                    if (isRef(ctx.busy)) {
                        ctx.busy.value = false;
                    }
                });
            }

            ctx.busy.value = false;

            return output;
        };
    }

    props.created = (item: T) => {
        if (typeof ctx.data === 'undefined') {
            if (ctx.onCreated) {
                ctx.onCreated(item);
            }
        }

        const data = unref(ctx.data);

        if (Array.isArray(data)) {
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);

            if (filterFn) {
                const index = findIndexOfMaybeRefArray<T>(
                    ctx.data as MaybeRef<T[]>,
                    filterFn,
                );

                if (index === -1) {
                    pushMaybeRefArrayValue(ctx.data as MaybeRef<T[]>, item);
                }
            }
        }

        if (typeof ctx.onCreated === 'function') {
            ctx.onCreated(item);
        }
    };

    props.deleted = (item: T | undefined) => {
        if (typeof ctx.data === 'undefined') {
            if (ctx.onDeleted && typeof item !== 'undefined') {
                ctx.onDeleted(item);
            }

            return;
        }

        const data = unref(ctx.data);

        if (
            Array.isArray(data) &&
            item
        ) {
            const filterFn = buildFilterFn(
                item,
                ctx.itemId,
                ctx.itemKey,
            ) as FilterFn<T> | undefined;

            if (filterFn) {
                const index = findIndexOfMaybeRefArray<T>(
                    ctx.data as MaybeRef<T[]>,
                    filterFn,
                );

                if (index !== -1) {
                    spliceMaybeRefArray(ctx.data as MaybeRef<T[]>, index, 1);
                }
            }
        }

        if (typeof ctx.onDeleted === 'function') {
            if (typeof item !== 'undefined') {
                ctx.onDeleted(item);
                return;
            }

            if (isRef(ctx.data)) {
                if (!Array.isArray(ctx.data.value)) {
                    ctx.onDeleted(ctx.data.value);
                }
            } else if (!Array.isArray(ctx.data)) {
                ctx.onDeleted(ctx.data);
            }
        }
    };

    props.updated = (item: T) => {
        if (typeof ctx.data === 'undefined') {
            if (ctx.onUpdated) {
                ctx.onUpdated(item);
            }

            return;
        }

        const data = unref(ctx.data);

        if (Array.isArray(data)) {
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);

            if (filterFn) {
                const index = findIndexOfMaybeRefArray<T>(
                    ctx.data as MaybeRef<T[]>,
                    filterFn,
                );

                if (index !== -1) {
                    extendMaybeRefArrayValue(ctx.data as MaybeRef<T[]>, index, item);
                }
            }

            if (typeof ctx.onUpdated === 'function') {
                ctx.onUpdated(item);
            }
        } else {
            extendMaybeRefObject(ctx.data as MaybeRef<T>, item);

            if (typeof ctx.onUpdated === 'function') {
                ctx.onUpdated(data);
            }
        }
    };

    return props;
}
