import type { ThemeElementDefinition } from '@vuecs/core';

export type TooltipThemeClasses = {
    /** Floating tooltip panel. */
    content: string;
    /** Trigger element wrapping the hover/focus target. */
    trigger: string;
    /** Arrow / pointer element. */
    arrow: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        tooltip?: ThemeElementDefinition<TooltipThemeClasses>;
    }
}
