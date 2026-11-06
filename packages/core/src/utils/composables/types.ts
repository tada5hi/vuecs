import type { ComputedRef, Ref } from 'vue';


export type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both';

export type ArrowNavigationOptions = {
    /** Restrict navigation to one axis. Default: `'both'`. */
    arrowKeyOptions?: ArrowKeyOptions;
    /** CSS selector that identifies collection items. Default: `'[data-vc-collection-item]'`. */
    attributeName?: string;
    /** Pre-resolved item array. Used when `parentElement` is unavailable. */
    itemsArray?: HTMLElement[];
    /** Wrap from last to first (and vice versa). Default: `true`. */
    loop?: boolean;
    /** Reading direction for horizontal arrows. Default: `'ltr'`. */
    dir?: 'ltr' | 'rtl';
    /** Call `event.preventDefault()` on a matching key. Default: `true`. */
    preventScroll?: boolean;
    /** Focus the resolved item before returning it. Default: `false`. */
    focus?: boolean;
    /** Skip navigation when the event originates from `<input>` / `<textarea>`. Default: `false`. */
    enableIgnoredElement?: boolean;
};

/**
 * Selection state machine — shared between `@vuecs/list` (ARIA
 * listbox pattern) and `@vuecs/table` (ARIA grid pattern). The
 * underlying state machinery is data-shape-agnostic: a `keyAt`
 * mapper resolves indices to keys (string | number), and the
 * v-model boundary is owned by the consumer (`emit` + a `value`
 * computed reading the v-model prop).
 *
 * The machine is **slim by design** — it tracks selection state
 * only, never focus. Focus management is the consumer's concern:
 * `<VCTable>` keeps `focusedRow` on its own context so the row's
 * roving-tabindex is a single source of truth; `<VCListItem>` can
 * apply the same pattern. Coupling focus to selection made the
 * shared API misleading.
 */

export type SelectionMode = 'single' | 'multi';

export type SelectionKey = string | number;

export type SelectionValue<M extends SelectionMode | undefined> =    M extends 'multi' ? SelectionKey[] :
    M extends 'single' ? (SelectionKey | null) :
        null;

export type SelectionState = {
    mode: ComputedRef<SelectionMode | undefined>;
    value: ComputedRef<SelectionValue<SelectionMode> | null>;
    isSelected(key: SelectionKey | undefined): boolean;
    toggle(key: SelectionKey, opts?: { range?: boolean; toggle?: boolean }): void;
    /**
     * Replace the entire selection value directly. Bypasses cycle /
     * range / toggle semantics — for callers that know exactly what
     * they want (e.g. a select-all header that clears or fills the
     * full set in one shot, or a "deselect everything" button).
     */
    setValue(next: SelectionValue<SelectionMode> | null): void;
    /**
     * Range anchor — set on plain click, used by Shift+click /
     * Shift+arrow to compute the selection span. Reset when the
     * user clicks/toggles without Shift.
     */
    rangeAnchor: Ref<SelectionKey | null>;
};

export type UseSelectionMachineArgs = {
    mode: ComputedRef<SelectionMode | undefined>;
    /** Reactive view onto v-model:selection. Read via `.value`. */
    value: ComputedRef<SelectionValue<SelectionMode> | null>;
    /** Emit a new selection value via the v-model update channel. */
    emit: (next: SelectionValue<SelectionMode> | null) => void;
    /**
     * Resolve a selection key by index (used by range select).
     * Returns the key at the given position in the iteration order,
     * or undefined when out of range.
     */
    keyAt: (index: number) => SelectionKey | undefined;
};



export type StateMachine<S extends string, E extends string> = Record<S, Partial<Record<E, S>>>;

export type TypeaheadItem<T = unknown> = {
    ref: HTMLElement;
    value?: T;
    // Split out of `value` (was `T & { textValue?: string }`) — the
    // intersection collapses `value` to `never` when `T` is a primitive
    // (e.g. `TypeaheadItem<string>`), making the field unusable for
    // non-object data sources.
    textValue?: string;
};
