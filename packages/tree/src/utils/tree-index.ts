import { isObject } from '@vuecs/core';
import type { TreeIndex, TreeIndexNode, TreeIndexOptions } from './types';

const DEFAULT_MAX_DEPTH = 100;

/**
 * Walk `items` once and precompute everything the tree needs that Reka's
 * visible-rows flatten can't answer: parent edges, child edges, levels, and
 * a stable pre-order over the **whole** tree.
 *
 * Children come exclusively from the injected `getChildren` — the literal
 * `children` key appears nowhere here. That is what makes the cascade work
 * for a consumer whose children live under a different key (reka's own
 * `flatten()` hard-codes `item.children` and silently breaks on this).
 *
 * `resolveKey` is called exactly once per item, here, so a consumer resolver
 * that dereferences (`(i) => i.id.toString()`) only ever sees a real item.
 */
export function buildTreeIndex<Item>(
    items: Item[],
    resolveKey: (item: Item) => string,
    getChildren: (item: Item) => Item[] | undefined,
    options: TreeIndexOptions<Item> = {},
): TreeIndex<Item> {
    const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;

    const nodes = new Map<string, TreeIndexNode<Item>>();
    const order: string[] = [];
    const refKeys = new WeakMap<object, string>();

    let duplicateWarned = false;
    let depthWarned = false;

    const walk = (list: Item[], level: number, parentKey?: string): string[] => {
        if (level > maxDepth) {
            if (!depthWarned) {
                depthWarned = true;
                // eslint-disable-next-line no-console
                console.warn(
                    `[vuecs/tree] nesting exceeded maxDepth (${maxDepth}); deeper items were dropped. ` +
                    'Check `getChildren` for a cycle.',
                );
            }

            return [];
        }

        const keys: string[] = [];

        for (const item of list) {
            const key = resolveKey(item);

            if (nodes.has(key)) {
                if (!duplicateWarned) {
                    duplicateWarned = true;
                    // eslint-disable-next-line no-console
                    console.warn(
                        `[vuecs/tree] duplicate item key "${key}"; the later item was skipped. ` +
                        'Provide `itemId` / `itemKey` that resolves uniquely.',
                    );
                }

                continue;
            }

            const children = getChildren(item);
            const node: TreeIndexNode<Item> = {
                key,
                item,
                parentKey,
                childKeys: [],
                level,
                resolved: typeof children !== 'undefined',
                disabled: options.isDisabled ? options.isDisabled(item) : false,
            };

            nodes.set(key, node);
            order.push(key);
            keys.push(key);

            if (isObject(item)) {
                refKeys.set(item, key);
            }

            if (children && children.length > 0) {
                node.childKeys = walk(children, level + 1, key);
            }
        }

        return keys;
    };

    const rootKeys = walk(items, 1);

    return {
        nodes,
        order,
        rootKeys,
        refKeys,
    };
}
