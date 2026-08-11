import { isObject } from '../object';
import type { CollectionItemIdFn, CollectionItemKey } from './types';

export function resolveItemIdentity<T>(
    item: T,
    itemId?: CollectionItemIdFn<T>,
    itemKey?: CollectionItemKey<T>,
): string | number | undefined {
    if (itemId) return itemId(item);
    if (itemKey) {
        const key = typeof itemKey === 'function' ? itemKey(item) : itemKey;
        // `key` is a string|number key of T, and we already narrowed against
        // `itemKey` being defined — so `item[key]` is sound. The runtime
        // check on `value` covers the case where the field exists but isn't
        // a string|number (resolveItemIdentity returns undefined; caller falls
        // through to the `.id` heuristic or the index).
        const value = item[key];
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
    }
    // After `isObject`, item is at least an indexable record. Annotate
    // a fresh local with the structural shape we care about (`{ id? }`)
    // so we read `.id` without an `unknown` cast.
    if (isObject(item)) {
        const obj : { id?: string | number } = item;
        if (typeof obj.id === 'string' || typeof obj.id === 'number') {
            return obj.id;
        }
    }
    return undefined;
}
