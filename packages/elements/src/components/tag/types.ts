import type { ThemeElementDefinition } from '@vuecs/core';

export type TagThemeClasses = {
    /** The chip's outer element. */
    root: string;
    /** Optional leading icon slot wrapper. */
    icon: string;
    /** Trailing remove-button slot. */
    remove: string;
};

export type TagListThemeClasses = {
    /** The flex container that wraps every chip. */
    root: string;
    /** Per-chip wrapper (`<VCTag>`'s root composes onto this). */
    item: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        tag?: ThemeElementDefinition<TagThemeClasses>;
        tagList?: ThemeElementDefinition<TagListThemeClasses>;
    }
}

/**
 * Item shape accepted by `<VCTagList>`. Structurally compatible with
 * `@vuecs/forms`' `FormOption` so consumers can hand the same array to
 * a select and a chip summary, but defined locally to keep
 * `@vuecs/elements` free of cross-package deps.
 */
export type TagItem = {
    /** Bound value — matches the chip identity (used as `key` and emitted on remove). */
    value: string | number;
    /** Display label; falls back to `value` when missing. */
    label?: string;
    /** Optional Iconify-style icon name forwarded to `<VCTag :icon>`. */
    icon?: string;
    /** When `true`, the chip is rendered without a remove button (overrides list-level `removable`). */
    disabled?: boolean;
};
