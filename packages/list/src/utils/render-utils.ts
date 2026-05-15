import { 
    Comment, 
    Fragment, 
    Text, 
    cloneVNode, 
} from 'vue';
import type { VNode } from 'vue';

/**
 * Merge slot props for a `<VCList*>` part so per-row / per-instance
 * fields (`extras`) always win over shared list state (`state`).
 * Centralises the spread order — easy to introduce a regression with
 * an off-by-one `{ ...a, ...b }` otherwise.
 */
export function mergeSlotProps<S extends object, E extends object>(
    state: S,
    extras: E,
): S & E {
    return { ...state, ...extras };
}

/**
 * Filter out comment nodes, whitespace-only text, and empty fragment
 * wrappers — return only the vnodes that would render observable
 * content. Used both for compound-vs-shorthand mode detection on
 * `<VCList>` and for the as-child fast-path below.
 */
export function meaningfulVNodes(nodes: VNode[] | undefined): VNode[] {
    if (!nodes) return [];
    const out: VNode[] = [];
    for (const vnode of nodes) {
        if (vnode.type === Fragment) {
            const children = Array.isArray(vnode.children) ? (vnode.children as VNode[]) : undefined;
            out.push(...meaningfulVNodes(children));
            continue;
        }
        if (vnode.type === Comment) continue;
        if (vnode.type === Text) {
            const text = vnode.children;
            if (typeof text === 'string' && text.trim().length === 0) continue;
        }
        out.push(vnode);
    }
    return out;
}

export function hasMeaningfulVNodes(nodes: VNode[] | undefined): boolean {
    return meaningfulVNodes(nodes).length > 0;
}

/**
 * Apply Reka-style `as-child` semantics: when the slot resolves to
 * exactly one meaningful vnode, clone it and merge `extra` (typically
 * `{ class }`) onto the clone so the consumer's element becomes the
 * part's root. Returns `null` when as-child cannot be honored (zero or
 * multiple meaningful children) — call sites fall back to a regular
 * wrapper element.
 *
 * Mirrors Reka's `Slot` for the single-child case; the multi-child
 * case is intentionally unsupported here (vuecs lists are not headless
 * primitives — multi-child as-child wrappers are a Reka complexity not
 * worth carrying for layout components).
 */
export function applyAsChild(
    nodes: VNode[] | undefined,
    extra: Record<string, unknown> = {},
): VNode | null {
    const meaningful = meaningfulVNodes(nodes);
    if (meaningful.length !== 1) return null;
    return cloneVNode(meaningful[0], extra, true);
}
