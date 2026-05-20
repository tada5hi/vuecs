import { Fragment } from 'vue';
import type { VNode } from 'vue';

/**
 * Flatten a slot's returned VNode array, unwrapping any `<Fragment>` wrappers
 * Vue inserts around `<template v-for>` / `<template v-if>` content.
 *
 * Mirrors reka-ui's `renderSlotFragments` (MIT,
 * https://github.com/unovue/reka-ui) so `@vuecs/core` stays zero-dep beyond Vue.
 */
export function renderSlotFragments(children?: VNode[]): VNode[] {
    if (!children) return [];
    return children.flatMap((child) => {
        if (child.type === Fragment) {
            return renderSlotFragments(child.children as VNode[]);
        }
        return [child];
    });
}
