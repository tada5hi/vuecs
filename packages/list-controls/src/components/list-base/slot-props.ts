import { hasOwnProperty, isObject } from '@vuecs/core';
import { merge } from 'smob';
import type { MaybeRef } from 'vue';
import type { ListItemId, ListItemKey } from '../type';
import type { ListBaseOptions, ListBaseSlotProps } from './types';

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

function mergeUnknown(primary: unknown, secondary: unknown) {
    if (
        isObject(primary) &&
        isObject(secondary)
    ) {
        return merge({}, primary, secondary);
    }

    return primary;
}

export function buildListBaseSlotProps<T, M = any>(
    ctx: ListBaseSlotPropsBuildContext<T, M>,
) : ListBaseSlotProps<T, M> {
    const props : ListBaseSlotProps<T, M> = {
        ...(ctx.busy ? { busy: ctx.busy } : {}),
        ...(ctx.meta ? { meta: ctx.meta } : {}),
        ...(ctx.total ? { total: ctx.total } : {}),
        ...(ctx.load ? { load: ctx.load } : {}),
    };

    props.created = (item: T) => {
        if (typeof ctx.data === 'undefined') {
            if (typeof ctx.onCreated === 'function') {
                ctx.onCreated(item);
            }

            return;
        }

        if (Array.isArray(ctx.data)) {
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);

            if (filterFn) {
                const index = ctx.data.findIndex(filterFn);
                if (index === -1) {
                    if (typeof ctx.onCreated === 'function') {
                        ctx.onCreated(item);
                    }
                }

                return;
            }
        }

        if (typeof ctx.onCreated === 'function') {
            ctx.onCreated(item);
        }
    };

    props.deleted = (item: T | undefined) => {
        if (typeof ctx.data === 'undefined') {
            if (typeof ctx.onDeleted === 'function' && item) {
                ctx.onDeleted(item);
            }

            return;
        }

        if (Array.isArray(ctx.data) && item) {
            const filterFn = buildFilterFn(
                item,
                ctx.itemId,
                ctx.itemKey,
            ) as FilterFn<T> | undefined;

            if (filterFn) {
                const index = ctx.data.findIndex(filterFn);
                if (index !== -1) {
                    if (typeof ctx.onDeleted === 'function') {
                        if (item) {
                            ctx.onDeleted(item);
                        } else {
                            ctx.onDeleted(ctx.data[index]);
                        }
                    }
                }

                return;
            }
        }

        if (typeof ctx.onDeleted === 'function') {
            if (item) {
                ctx.onDeleted(item);

                return;
            }

            if (!Array.isArray(ctx.data)) {
                ctx.onDeleted(ctx.data as T);
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

        if (Array.isArray(ctx.data)) {
            const filterFn = buildFilterFn(item, ctx.itemId, ctx.itemKey);

            if (filterFn) {
                const index = ctx.data.findIndex(filterFn);

                if (index !== -1) {
                    if (typeof ctx.onUpdated === 'function') {
                        ctx.onUpdated(mergeUnknown(item, ctx.data[index]) as T);
                    }
                }

                return;
            }

            if (typeof ctx.onUpdated === 'function') {
                ctx.onUpdated(item);
            }

            return;
        }

        if (typeof ctx.onUpdated === 'function') {
            ctx.onUpdated(mergeUnknown(item, ctx.data) as T);
        }
    };

    return props;
}
