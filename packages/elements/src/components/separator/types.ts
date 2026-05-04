import type { ThemeElementDefinition } from '@vuecs/core';

export type SeparatorThemeClasses = {
    /** The separator element itself. */
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        separator?: ThemeElementDefinition<SeparatorThemeClasses>;
    }
}
