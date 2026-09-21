import { inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';
import type { TreeItemThemeClasses } from '../types';

export type TreeSelectOptions = {
    /** Shift-click — extend from the range anchor. */
    range?: boolean,
    /** Ctrl / Cmd-click — toggle one without affecting the rest. */
    toggle?: boolean
};

export type TreeContext = {
    classes: ComputedRef<TreeItemThemeClasses>,
    /**
     * `true` when rows should render the WAI-ARIA *tree with checkboxes*
     * pattern (`aria-checked`, which can be `"mixed"`) rather than the plain
     * *tree* pattern (`aria-selected`, which is binary) — i.e. whenever a
     * cascade can produce a partially-selected branch.
     */
    checkboxMode: ComputedRef<boolean>,
    isSelected: (key: string) => boolean,
    isIndeterminate: (key: string) => boolean,
    isLoading: (key: string) => boolean,
    select: (key: string, options?: TreeSelectOptions) => void,
    toggle: (key: string) => void
};

const TREE_CONTEXT_KEY: InjectionKey<TreeContext> = Symbol.for('VCTreeContext');

export function provideTreeContext(context: TreeContext): void {
    provide(TREE_CONTEXT_KEY, context);
}

/**
 * Strict inject — `<VCTreeItem>` is only meaningful inside a `<VCTree>`
 * (reka's own `TreeItem` throws without its root context too).
 */
export function useTree(): TreeContext {
    const context = inject(TREE_CONTEXT_KEY, null);
    if (!context) {
        throw new Error('[vuecs/tree] <VCTreeItem> must be rendered inside a <VCTree>.');
    }

    return context;
}
