/* eslint-disable @tada5hi/no-reexport-shims -- Preserve this existing public forwarding module. */
/**
 * Thin re-export over `@vuecs/core`'s shared `useSelectionMachine` —
 * same composable powers `@vuecs/table` (ARIA grid). The slim shape
 * tracks selection state only; focus management lives on the
 * per-component scope (see `<VCListItem>`'s `isFocused`).
 */
export {
    useSelectionMachine,
} from '@vuecs/core';
export type {
    SelectionKey,
    SelectionMode,
    SelectionState,
    SelectionValue,
    UseSelectionMachineArgs,
} from '@vuecs/core';
