import type { ThemeElementDefinition } from '@vuecs/core';

export type PopoverThemeClasses = {
    /** Floating panel (the actual popover content). */
    content: string;
    /** Trigger element that toggles the popover. */
    trigger: string;
    /** Arrow / pointer element. */
    arrow: string;
    /**
     * Generic close-trigger button. Neutral by design so consumer classes
     * layered via `class=` compose cleanly. Used by `<VCPopoverClose>`.
     */
    close: string;
    /**
     * Corner-X close button. Carries absolute positioning + sizing so it
     * docks into the popover's top-right corner. Used by `<VCPopoverCloseIcon>`.
     */
    closeIcon: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        popover?: ThemeElementDefinition<PopoverThemeClasses>;
    }
}
