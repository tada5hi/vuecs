import type { CascadeResult, TreeIndex } from './types';

/**
 * Cascade kernel — pure, whole-tree, idempotent.
 *
 * Both of reka-ui's cascade defects are structurally impossible here rather
 * than worked around:
 *
 *  - Its `propagateSelect` descendant walk recurses on a hard-coded
 *    `item.children`, ignoring `getChildren`. Ours walks `childKeys`, which
 *    the index built from the injected resolver.
 *  - Its `bubbleSelect` resolves parents out of the *visible* flattened
 *    list, so a collapsed parent never updates. `normalize()` iterates the
 *    whole index; expansion is not an input to it at all.
 *
 * **Disabled children do not gate their parent.** A branch whose only
 * unselected child is disabled therefore reports fully selected. The
 * alternative — letting an unreachable child hold its parent permanently
 * indeterminate — is worse; the user has no way to resolve it.
 *
 * **Unresolved branches are leaves.** A node whose children haven't been
 * loaded yet (`resolved: false`) keeps its explicit state instead of being
 * derived from children that aren't there.
 */

/**
 * Derive every ancestor's state from its children, bottom-up, in one pass.
 *
 * `index.order` is pre-order, so iterating it backwards visits every node
 * after all of its descendants — a post-order walk without building one.
 *
 * Idempotent: `normalize(normalize(x)) === normalize(x)`. That is what lets
 * the same function serve a click, a lazy-load reconcile and an `:items`
 * replacement.
 *
 * Keys not present in the index are left untouched, so a deep-linked
 * selection whose branch hasn't loaded survives.
 */
export function normalize<Item>(index: TreeIndex<Item>, selected: Set<string>): CascadeResult {
    const next = new Set(selected);
    const indeterminate = new Set<string>();

    for (let i = index.order.length - 1; i >= 0; i -= 1) {
        const node = index.nodes.get(index.order[i]);
        if (!node || !node.resolved || node.childKeys.length === 0) {
            continue;
        }

        let all = true;
        let any = false;
        let counted = 0;

        for (const childKey of node.childKeys) {
            const child = index.nodes.get(childKey);
            if (!child || child.disabled) {
                continue;
            }

            counted += 1;

            if (indeterminate.has(childKey)) {
                any = true;
                all = false;
                continue;
            }

            if (next.has(childKey)) {
                any = true;
            } else {
                all = false;
            }
        }

        if (counted === 0) {
            continue;
        }

        if (all) {
            next.add(node.key);
        } else {
            next.delete(node.key);
        }

        if (any && !all) {
            indeterminate.add(node.key);
        }
    }

    return { selected: next, indeterminate };
}

/**
 * Toggle `key` and cascade the result: descendants explicitly, ancestors and
 * indeterminate state implicitly via `normalize()`.
 *
 * The clicked node is always written even when disabled — the caller decides
 * whether a disabled row is clickable at all; once it has decided, the
 * cascade honours it. Disabled *descendants* are never written.
 */
export function cascadeSelect<Item>(
    index: TreeIndex<Item>,
    current: ReadonlySet<string>,
    key: string,
    on: boolean,
): CascadeResult {
    const next = new Set(current);
    const stack: string[] = [key];

    while (stack.length > 0) {
        const currentKey = stack.pop() as string;
        const node = index.nodes.get(currentKey);

        if (!node) {
            // Unknown key (stale deep link) — treat as a leaf.
            if (currentKey === key) {
                if (on) {
                    next.add(currentKey);
                } else {
                    next.delete(currentKey);
                }
            }

            continue;
        }

        if (!node.disabled || currentKey === key) {
            if (on) {
                next.add(currentKey);
            } else {
                next.delete(currentKey);
            }
        }

        for (const childKey of node.childKeys) {
            stack.push(childKey);
        }
    }

    return normalize(index, next);
}

/**
 * Order a selection set by the tree's pre-order, appending keys the index
 * doesn't know about (unloaded branches) at the tail so they survive a
 * round-trip through `v-model`.
 */
export function orderKeys<Item>(index: TreeIndex<Item>, selected: ReadonlySet<string>): string[] {
    const out: string[] = [];

    for (const key of index.order) {
        if (selected.has(key)) {
            out.push(key);
        }
    }

    for (const key of selected) {
        if (!index.nodes.has(key)) {
            out.push(key);
        }
    }

    return out;
}
