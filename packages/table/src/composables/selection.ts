/**
 * Thin re-export over `@vuecs/core`'s shared `useSelectionMachine` —
 * the same composable powers `@vuecs/list` (ARIA listbox) and
 * `@vuecs/table` (ARIA grid). Table-specific `RowSelection*` aliases
 * are kept for back-compat with consumers who imported the older
 * names; new code can import directly from `@vuecs/core`.
 */
export {
    useSelectionMachine as useRowSelectionMachine,
} from '@vuecs/core';
export type {
    SelectionKey as RowSelectionKey,
    SelectionMode as RowSelectionMode,
    SelectionState as RowSelectionState,
    SelectionValue as RowSelectionValue,
    UseSelectionMachineArgs as UseRowSelectionMachineArgs,
} from '@vuecs/core';
