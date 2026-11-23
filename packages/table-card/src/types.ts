import type {
    ComponentDefaultValues,
    CoreOptions,
    ThemeElementDefinition,
} from '@vuecs/core';

export type TableCardThemeClasses = {
    /** The outer `<VCCard>`. */
    root: string;
    /** The `<VCCardHeader>` band (heading + toolbar). */
    header: string;
    /** Wrapper around title + description. */
    heading: string;
    /** The `<VCCardTitle>`. */
    title: string;
    /** The `<VCCardDescription>`. */
    description: string;
    /** Wrapper around the search input + `#actions`. */
    toolbar: string;
    /** The search `<input>` (only rendered with `searchable`). */
    search: string;
    /** Wrapper around the `#actions` slot. */
    actions: string;
    /** The `<VCCardBody>` (main + aside). */
    body: string;
    /** Wrapper around the table / empty state. */
    main: string;
    /** Wrapper around the `#aside` slot. */
    aside: string;
    /** The `<VCCardFooter>` holding the pagination. */
    footer: string;
};

export type TableCardDefaults = {
    /** Placeholder (and accessible label) of the search input. */
    searchPlaceholder: string;
    /** Title of the built-in `empty` state (no `#empty` slot). */
    emptyTitle: string;
};

export type TableCardNoResultsSlotProps = {
    /** Invoke to emit the card's `reset` event. */
    reset: () => void;
};

export type Options = CoreOptions;

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        tableCard?: ThemeElementDefinition<TableCardThemeClasses>;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ComponentDefaults {
        tableCard?: ComponentDefaultValues<TableCardDefaults>;
    }
}
