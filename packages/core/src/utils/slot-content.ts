import {
    Comment,
    Fragment,
    Text,
} from 'vue';
import type { VNode } from 'vue';

/**
 * Whether the given rendered slot output carries *meaningful* content —
 * i.e. would produce visible / structural DOM rather than only comment
 * anchors (`v-if="false"`), whitespace text, or an empty array.
 *
 * Vue hands a declared `<template #slot>` to a component as an
 * always-present render function, so a naive `slots.foo?.()` truthiness
 * check can't tell "consumer passed real content" apart from "slot
 * declared but rendered nothing". Pass the *rendered* vnodes (invoke the
 * slot at most once per render — slot fns can be non-trivial) and let this
 * walk them: it recurses into `Fragment` children, so a `<template v-if>` /
 * `<template v-for>` / multi-root slot is classified by its actual
 * contents rather than by the wrapping Fragment.
 *
 * Callers use it to decide whether to render a slot's wrapper vs fall back
 * to a prop / default (`<VCAlert #icon>`, `<VCButton #leading>`) and
 * whether a cell should auto-render its column value (`<VCTableCell>`).
 */
export function isMeaningfulSlotContent(nodes: unknown): boolean {
    if (nodes == null || nodes === false) return false;
    if (typeof nodes === 'string') return nodes.trim().length > 0;
    if (typeof nodes === 'number') return true;
    if (Array.isArray(nodes)) {
        return nodes.some((child) => isMeaningfulSlotContent(child));
    }
    if (typeof nodes !== 'object') return false;
    const v = nodes as VNode;
    if (v.type === Comment) return false;
    if (v.type === Text) {
        return typeof v.children === 'string' && v.children.trim().length > 0;
    }
    if (v.type === Fragment) {
        return isMeaningfulSlotContent(v.children);
    }
    // Element or component vnode (string tag, object component, or a
    // symbol type other than the ones handled above).
    return true;
}
