import type { ThemeElementDefinition } from '@vuecs/core';

export type HoverCardThemeClasses = {
    /** Trigger element that the hover card anchors to. */
    trigger: string;
    /** Floating panel (the hover card content). */
    content: string;
    /** Arrow / pointer element. */
    arrow: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        hoverCard?: ThemeElementDefinition<HoverCardThemeClasses>;
    }
}
