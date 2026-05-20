import type {
    CoreOptions,
    ThemeElementDefinition,
} from '@vuecs/core';

export type Options = CoreOptions;

/** Sizing tiers — drive the bar height (the `:width` prop drives the bar width). */
export type PlaceholderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Shimmer animation flavor. `none` disables the animation entirely. */
export type PlaceholderAnimation = 'wave' | 'glow' | 'none';

// ──────────────────────────────────────────────────────────────────────────
// Per-component theme classes
// ──────────────────────────────────────────────────────────────────────────

export type PlaceholderThemeClasses = {
    /** The placeholder bar element (typically a `<span>` styled as a block). */
    root: string;
    /** Wrapper applied when `:animation="wave"` is active. */
    wave: string;
    /** Wrapper applied when `:animation="glow"` is active. */
    glow: string;
};

export type PlaceholderTableThemeClasses = {
    /** Outer `<table>` element. */
    root: string;
    /** `<thead>` band (when `:showHeader` is on). */
    header: string;
    /** `<tbody>` band. */
    body: string;
    /** `<tfoot>` band (when `:showFooter` is on). */
    footer: string;
    /** Per-row `<tr>` element. */
    row: string;
    /** Per-cell `<td>` / `<th>` wrapper around the bar. */
    cell: string;
};

export type PlaceholderCardThemeClasses = {
    /** Outer card wrapper (`<div>`). */
    root: string;
    /** Wrapper around the cover-image placeholder. */
    image: string;
    /** Wrapper around the header line (typically a wide bar). */
    header: string;
    /** Wrapper around the body lines. */
    body: string;
    /** Wrapper around the footer block (typically two short bars). */
    footer: string;
};

export type PlaceholderWrapperThemeClasses = {
    /** Wrapper `<div>`. */
    root: string;
};

// ──────────────────────────────────────────────────────────────────────────
// ThemeElements registry augmentation
// ──────────────────────────────────────────────────────────────────────────

declare module '@vuecs/core' {
    interface ThemeElements {
        placeholder?: ThemeElementDefinition<PlaceholderThemeClasses>;
        placeholderTable?: ThemeElementDefinition<PlaceholderTableThemeClasses>;
        placeholderCard?: ThemeElementDefinition<PlaceholderCardThemeClasses>;
        placeholderWrapper?: ThemeElementDefinition<PlaceholderWrapperThemeClasses>;
    }
}
