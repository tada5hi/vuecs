import { resolveItemIdentity } from './identity';
import type { CollectionMutationFlags, CollectionMutations, CollectionMutationsOptions } from './types';

export function createCollectionMutations<T>(
    options: CollectionMutationsOptions<T>,
) : CollectionMutations<T> {
    const flags : CollectionMutationFlags = {
        mergeOnUpdated: !!options.flags?.mergeOnUpdated,
        dedupCreated: !!options.flags?.dedupCreated,
        filterDeleted: !!options.flags?.filterDeleted,
    };

    const getItemKey = (item: T) => resolveItemIdentity(item, options.itemId, options.itemKey);

    const indexOf = (arr: T[], item: T) : number => {
        const target = getItemKey(item);
        if (target === undefined) return arr.indexOf(item);
        return arr.findIndex((candidate) => getItemKey(candidate) === target);
    };

    const applyCreate = (current: T[], item: T) : T[] => {
        if (flags.dedupCreated && indexOf(current, item) >= 0) {
            return current;
        }
        return [...current, item];
    };

    const applyUpdate = (current: T[], item: T) : T[] => {
        const idx = indexOf(current, item);
        if (idx < 0) return current;
        const next = current.slice();
        if (flags.mergeOnUpdated) {
            if (options.merge) {
                next[idx] = options.merge(current[idx] as object, item as object) as T;
            } else {
                // `globalThis.process` is the safe lookup in browser
                // ESM builds where `process` isn't a global; raw
                // `process.env.NODE_ENV` would throw ReferenceError.
                if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.warn('createCollectionMutations: mergeOnUpdated is set but no merge fn was provided; falling back to replace.');
                }
                next[idx] = item;
            }
        } else {
            next[idx] = item;
        }
        return next;
    };

    const applyDelete = (current: T[], item: T) : T[] => {
        const idx = indexOf(current, item);
        if (idx < 0) {
            if (flags.filterDeleted) return current;
            // The reference filter exists for identity-less items. When it
            // removes nothing, preserve the ORIGINAL reference — callers key
            // off `next === current` to skip their write path, and a fresh
            // same-length array would fire it for a no-op.
            const next = current.filter((c) => c !== item);
            return next.length === current.length ? current : next;
        }
        return [...current.slice(0, idx), ...current.slice(idx + 1)];
    };

    return {
        flags,
        getItemKey,
        indexOf,
        applyCreate,
        applyUpdate,
        applyDelete,
    };
}
