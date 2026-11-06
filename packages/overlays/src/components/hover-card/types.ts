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
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        hoverCard?: ThemeElementDefinition<HoverCardThemeClasses>;
    }
}
