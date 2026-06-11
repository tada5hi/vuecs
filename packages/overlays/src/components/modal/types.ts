import type { ThemeElementDefinition } from '@vuecs/core';

/**
 * Dismissal policy for `<VCModalContent>` — which built-in close
 * interactions are honored. Explicit triggers (`<VCModalClose>`, the
 * corner-X, programmatic `v-model:open` writes) always work.
 *
 * - `always` — Escape and outside interaction both close (Reka default).
 * - `no-escape` — Escape is ignored; outside interaction still closes.
 * - `no-outside` — outside interaction is ignored; Escape still closes.
 * - `never` — neither closes (busy overlays, modals holding in-progress
 *   form input).
 */
export type ModalClosePolicy = 'always' | 'no-escape' | 'no-outside' | 'never';

export type ModalThemeClasses = {
    /** Backdrop / overlay layer behind the dialog content. */
    overlay: string;
    /** Dialog content container (the actual focused panel). */
    content: string;
    /** Header region (default slot composition). */
    header: string;
    /** Title element (`DialogTitle`). */
    title: string;
    /** Description element (`DialogDescription`). */
    description: string;
    /** Body region (default slot composition). */
    body: string;
    /** Footer region (default slot composition). */
    footer: string;
    /** Trigger button element. */
    trigger: string;
    /**
     * Generic close-trigger button. Neutral by design (just focus-ring +
     * button affordances) so consumer classes layered via `class=` compose
     * cleanly. Used by `<VCModalClose>`.
     */
    close: string;
    /**
     * Corner-X close button. Carries absolute positioning + sizing so it
     * docks into the dialog's top-right corner. Used by the corner-X
     * presentation of `<VCModalClose>` (slotless or with the `icon` prop).
     */
    closeIcon: string;
    /** "Back" button shown when the view stack has history. */
    back: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        modal?: ThemeElementDefinition<ModalThemeClasses>;
    }
}
