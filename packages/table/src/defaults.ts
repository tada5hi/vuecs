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

declare module '@vuecs/core' {
    interface ComponentDefaults {
        tableEmpty?: ComponentDefaultValues<TableEmptyDefaults>;
        tableLoading?: ComponentDefaultValues<TableLoadingDefaults>;
    }
}
