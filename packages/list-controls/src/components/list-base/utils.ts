import { merge } from 'smob';
import {
    createComponentOptionsManager,
    extendMaybeRefArrayValue,
    findIndexOfMaybeRefArray,
    hasOwnProperty,
    isObject,
    isPromise,
    pushMaybeRefArrayValue, setMaybeRefValue,
    spliceMaybeRefArray,
} from '@vuecs/core';
import { isReactive, isRef, unref } from 'vue';
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

    const manager = createComponentOptionsManager<ListBaseOptions<Entity<T>, M>>({
        name: component,
    });

    return {
        slotItems: options.slotItems || {},
        slotProps: manager.buildOrFail({
            key: 'slotProps',
            value: options.slotProps,
            alt: defaults.slotProps || {},
        }),
        slotPropsBuilt: options.slotPropsBuilt,

        tag: manager.buildOrFail({
            key: 'tag',
            value: options.tag,
            alt: defaults.tag || 'div',
        }),
        class: manager.buildOrFail({
            key: 'class',
            value: options.class,
            alt: defaults.class || [],
        }),
        props: manager.buildOrFail({
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

    const incrTotal = () => {
        if (typeof ctx.total === 'undefined') {
            return;
        }

        if (isRef(ctx.total)) {
            ctx.total.value++;
            props.total = ctx.total.value;
        }
    };

    const decrTotal = () => {
        if (typeof ctx.total === 'undefined') {
            return;
        }

        if (isRef(ctx.total)) {
            ctx.total.value--;
            props.total = ctx.total.value;
        }
    };

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
            if (typeof ctx.onCreated === 'function') {
                ctx.onCreated(item);
            }

            incrTotal();

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

                if (index === -1) {
                    pushMaybeRefArrayValue(ctx.data as MaybeRef<T[]>, item);

                    incrTotal();

                    if (typeof ctx.onCreated === 'function') {
                        ctx.onCreated(item);
                    }
                }
            }
        } else {
            incrTotal();

            if (typeof ctx.onCreated === 'function') {
                ctx.onCreated(item);
            }
        }
    };

    props.deleted = (item: T | undefined) => {
        if (typeof ctx.data === 'undefined') {
            if (typeof ctx.onDeleted === 'function' && item) {
                ctx.onDeleted(item);
            }

            decrTotal();

            return;
        }

        const data = unref(ctx.data);

        if (Array.isArray(data)) {
            if (item) {
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

                        decrTotal();

                        if (typeof ctx.onDeleted === 'function') {
                            if (item) {
                                ctx.onDeleted(item);
                            } else {
                                ctx.onDeleted(data[index]);
                            }
                        }
                    }
                }
            }
        } else {
            decrTotal();

            if (typeof ctx.onDeleted === 'function') {
                if (item) {
                    ctx.onDeleted(item);
                } else {
                    ctx.onDeleted(data);
                }
            }
        }
    };

    props.updated = (item: T) => {
        if (typeof ctx.data === 'undefined') {
            if (typeof ctx.onUpdated === 'function') {
                ctx.onUpdated(item);
            }

            return;
        }

        let data = unref(ctx.data);

        if (Array.isArray(data)) {
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);

            if (filterFn) {
                const index = findIndexOfMaybeRefArray<T>(
                    ctx.data as MaybeRef<T[]>,
                    filterFn,
                );

                if (index !== -1) {
                    extendMaybeRefArrayValue(ctx.data as MaybeRef<T[]>, index, item);

                    if (typeof ctx.onUpdated === 'function') {
                        ctx.onUpdated(item); // todo: extend with data
                    }
                }
            }
        } else {
            if (
                isObject(item) &&
                isObject(data)
            ) {
                data = merge(item, data) as T;
            } else {
                data = item;
            }

            if (isReactive(ctx.data)) {
                ctx.data = data;
            } else {
                setMaybeRefValue(ctx.data, data);
            }

            if (typeof ctx.onUpdated === 'function') {
                ctx.onUpdated(data);
            }
        }
    };

    return props;
}
