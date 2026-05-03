import type { ThemeElementDefinition } from '@vuecs/core';

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
     * docks into the dialog's top-right corner. Used by `<VCModalCloseIcon>`.
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
