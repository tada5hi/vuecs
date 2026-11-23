import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

/** `empty` — the collection has no records yet; `noResults` — a search / filter matched nothing. */
export type EmptyStateVariant = 'empty' | 'noResults';

export type EmptyStateThemeClasses = {
    /** Outer container (dashed-border, centered card). */
    root: string;
    /** Icon wrapper (`#icon` slot or `icon` prop). */
    icon: string;
    /** Title element. */
    title: string;
    /** Description wrapper (`description` prop or `#default` slot). */
    description: string;
    /** Action element — the built-in `<button>` or the `#action` slot's `class` prop. */
    action: string;
};

export type EmptyStateDefaults = {
    /** Title for `variant="noResults"` when no `title` is passed. */
    noResultsTitle: string;
    /** Description for `variant="noResults"` when no `description` is passed. */
    noResultsDescription: string;
    /** Action label for `variant="noResults"` when no `actionLabel` is passed. */
    noResultsActionLabel: string;
};

export type EmptyStateIconSlotProps = {
    /** Resolved theme class for the icon wrapper. */
    class: string;
};

export type EmptyStateActionSlotProps = {
    /** Resolved theme class for the action element. */
    class: string;
    /** Invoke to emit the component's `action` event. */
    action: () => void;
};

export type EmptyStateSlots = {
    /** Body content — replaces the `description` prop. */
    default?: Record<string, never>;
    /** Leading icon — replaces the `icon` prop. */
    icon?: EmptyStateIconSlotProps;
    /** Title content — replaces the `title` prop. */
    title?: Record<string, never>;
    /** Custom action (e.g. a router link) — replaces the built-in button. */
    action?: EmptyStateActionSlotProps;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        emptyState?: ThemeElementDefinition<EmptyStateThemeClasses>;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ComponentDefaults {
        emptyState?: ComponentDefaultValues<EmptyStateDefaults>;
    }
}
