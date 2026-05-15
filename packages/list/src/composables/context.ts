import { inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';
import type { ListItemThemeClasses, ListThemeClasses } from '../types';
import type { ListState } from './define-list';
import type { SelectionState } from './selection';

/**
 * List-scope context. Provided by `<VCList>` to all descendants.
 *
 * Bundles state (data/busy/total/meta + mutators from `defineList`),
 * resolved theme classes for the list (root/header/footer), and the
 * selection state machine. Empty selection (no `selection-mode` set)
 * uses `createNoOpSelection()` so descendants don't need to null-check.
 */
type ListContext = {
    state: ListState<unknown, Record<string, unknown>>;
    classes: ComputedRef<ListThemeClasses>;
    selection: SelectionState;
};

const LIST_CONTEXT_KEY = Symbol('VCListContext') as InjectionKey<ListContext>;

export function provideListContext(ctx: ListContext): void {
    provide(LIST_CONTEXT_KEY, ctx);
}

function injectListContext(componentName?: string): ListContext {
    const ctx = inject(LIST_CONTEXT_KEY, undefined);
    if (!ctx) {
        throw new Error(
            componentName ?
                `[@vuecs/list] <${componentName}> must be used inside a <VCList>.` :
                '[@vuecs/list] useList() must be called inside a <VCList>.',
        );
    }
    return ctx;
}

/**
 * Pull the active list context from the parent `<VCList>`. Strict by
 * design — throws when called outside a `<VCList>` so misuse fails
 * loudly. Returns the merged state + classes + selection bag.
 *
 * Type parameters narrow the state's row type / meta bag; classes +
 * selection remain typed at the package level.
 */
export function useList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(componentName?: string): ListContext & {
    state: ListState<T, Meta>;
} {
    const ctx = injectListContext(componentName);
    // Type-erased context narrowed by the consumer's explicit type
    // parameters. Same pattern as the previous `useList<T, Meta>()`
    // overload — the cast is bounded by the caller's intent.
    return ctx as ListContext & { state: ListState<T, Meta> };
}

// -----------------------------------------------------------------------
// Item-scope context — provided by `<VCListItem>` to its descendants.
// -----------------------------------------------------------------------

type ListItemContext = {
    /** The row data — read-only computed. */
    data: ComputedRef<unknown>;
    /** Row index within the iteration. -1 when used outside an iteration context. */
    index: ComputedRef<number>;
    /** Stable identity key (from `defineList.getItemKey`). Undefined when no identity hint. */
    key: ComputedRef<string | number | undefined>;
    /** Resolved item-level theme classes. */
    classes: ComputedRef<ListItemThemeClasses>;
    /** Whether this row is in the current selection. */
    isSelected: ComputedRef<boolean>;
    /** Whether this row carries the roving-tabindex focus. */
    isFocused: ComputedRef<boolean>;
    /** Whether `<VCListItem :disabled>` was set. */
    isDisabled: ComputedRef<boolean>;
    /** Whether `<VCListItem :active>` was set (routing-style highlight). */
    isActive: ComputedRef<boolean>;
    /** Whether `<VCListItem :selectable>` was set. */
    isSelectable: ComputedRef<boolean>;
    /**
     * Trigger selection toggle for this row. No-op when not selectable,
     * disabled, or when the parent has no selection-mode set.
     */
    toggle: (opts?: { range?: boolean; toggle?: boolean }) => void;
};

const LIST_ITEM_CONTEXT_KEY = Symbol('VCListItemContext') as InjectionKey<ListItemContext>;

export function provideListItemContext(ctx: ListItemContext): void {
    provide(LIST_ITEM_CONTEXT_KEY, ctx);
}

/**
 * Pull the active row context from the parent `<VCListItem>`. Strict —
 * throws outside a `<VCListItem>`. Returns the merged per-row state +
 * resolved classes + selection helpers.
 *
 * Use this in row-content child SFCs (e.g. authup's `<AUserRow>`)
 * that render inside `<VCListItem>` and need per-row data + classes
 * without slot-prop drilling.
 */
export function useListItem<T = unknown>(componentName?: string): ListItemContext & {
    data: ComputedRef<T>;
} {
    const ctx = inject(LIST_ITEM_CONTEXT_KEY, undefined);
    if (!ctx) {
        throw new Error(
            componentName ?
                `[@vuecs/list] <${componentName}> must be used inside a <VCListItem>.` :
                '[@vuecs/list] useListItem() must be called inside a <VCListItem>.',
        );
    }
    return ctx as ListItemContext & { data: ComputedRef<T> };
}

