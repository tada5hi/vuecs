import type { ThemeElementDefinition } from '@vuecs/core';

export type PopoverThemeClasses = {
    /** Floating panel (the actual popover content). */
    content: string;
    /** Trigger element that toggles the popover. */
    trigger: string;
    /** Arrow / pointer element. */
    arrow: string;
    /** Close button (optional). */
    close: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        popover?: ThemeElementDefinition<PopoverThemeClasses>;
    }
}
