import type { ComponentDefaultValues } from '@vuecs/core';

export type TableEmptyDefaults = {
    /** Default text rendered when `data.length === 0 && !busy && !filtered`. */
    content: string;
    /** Default text rendered when `:filtered` is set (empty-after-filter case). */
    filteredContent: string;
};

export type TableLoadingDefaults = {
    /** Default text rendered during the first-load placeholder + overlay variant. */
    content: string;
};

export type TableExpandTriggerDefaults = {
    /** `aria-label` painted on the trigger button while the row is collapsed. */
    expandLabel: string;
    /** `aria-label` painted on the trigger button while the row is expanded. */
    collapseLabel: string;
    /** Iconify name for the auto-injected chevron icon. Usually wired by `@vuecs/icons-lucide`. */
    chevronIcon: string;
};

export type TableSortIndicatorsDefaults = {
    /** Leading label rendered before the chip list. */
    label: string;
    /** Empty-state message when no columns are sorted yet. */
    emptyContent: string;
    /** Trigger text for the add-column dropdown. */
    addLabel: string;
    /** Trigger text for the clear-all button. */
    clearLabel: string;
    /** `aria-label` for each chip remove button. */
    removeAriaLabel: string;
    /** Per-chip `title` hint when direction is currently asc. */
    toggleAscTitle: string;
    /** Per-chip `title` hint when direction is currently desc. */
    toggleDescTitle: string;
    /** Glyph rendered when a descriptor's direction is `'asc'`. */
    arrowAsc: string;
    /** Glyph rendered when a descriptor's direction is `'desc'`. */
    arrowDesc: string;
    /** Glyph rendered inside the per-chip remove button. */
    removeGlyph: string;
};

declare module '@vuecs/core' {
    interface ComponentDefaults {
        tableEmpty?: ComponentDefaultValues<TableEmptyDefaults>;
        tableLoading?: ComponentDefaultValues<TableLoadingDefaults>;
        tableExpandTrigger?: ComponentDefaultValues<TableExpandTriggerDefaults>;
        tableSortIndicators?: ComponentDefaultValues<TableSortIndicatorsDefaults>;
    }
}
