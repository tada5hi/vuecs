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
    hasOwnProperty,
    isPromise,
    pushMaybeRefArrayValue,
    spliceMaybeRefArray,
} from '@vue-layout/core';
import { isRef, unref } from 'vue';
import type { MaybeRef, Ref } from 'vue';
import type { Component } from '../constants';
import type {
    ListItemId,
    ListItemKey,
} from '../type';
import type {
    ListBaseOptions, ListBaseOptionsDefaults, ListBaseOptionsInput, ListBaseSlotProps,
} from './type';

type Entity<T extends ListBaseOptionsInput<any>> = T extends ListBaseOptionsInput<infer U> ? U : never;

export function buildListBaseOptions<
    T extends ListBaseOptionsInput<any>,
    C extends Component,
>(
    options: T,
    component: Component,
    defaults?: ListBaseOptionsDefaults<Entity<T>>,
): ListBaseOptions<Entity<T>> {
    defaults = defaults || {};

    const { buildOrFail } = createOptionBuilder<ListBaseOptions<Entity<T>>>(
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

        load: options.load,
        meta: options.meta || {},
        busy: options.busy,

        itemId: options.itemId,
        itemKey: options.itemKey,

        onCreated: options.onCreated,
        onUpdated: options.onUpdated,
        onDeleted: options.onDeleted,
    };
}

type ListBaseSlotPropsBuildContext<T extends Record<string, any>> = Pick<
ListBaseOptions<T>,
'meta' |
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

type FilterFn<T extends Record<string, any>> = (item: T, index?: number) => boolean;
const buildFilterFn = <T extends Record<string, any>>(
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
        hasOwnProperty(item, 'id')
    ) {
        filterFn = (el) => el['id' as keyof T] === item['id' as keyof T];
    }

    return filterFn;
};
export function buildListBaseSlotProps<T extends Record<string, any>>(
    ctx: ListBaseSlotPropsBuildContext<T>,
) : ListBaseSlotProps<T> {
    const props : ListBaseSlotProps<T> = {};

    if (typeof ctx.busy !== 'undefined') {
        props.busy = unref(ctx.busy);
    }

    if (typeof ctx.meta !== 'undefined') {
        props.meta = ctx.meta;
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
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);
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
