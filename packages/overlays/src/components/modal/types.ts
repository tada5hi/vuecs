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
    /** Close button element. */
    close: string;
    /** "Back" button shown when the view stack has history. */
    back: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        modal?: ThemeElementDefinition<ModalThemeClasses>;
    }
}
