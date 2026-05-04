import type { ThemeElementDefinition } from '@vuecs/core';

export type AspectRatioThemeClasses = {
    /** The outer wrapper that maintains the ratio. */
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        aspectRatio?: ThemeElementDefinition<AspectRatioThemeClasses>;
    }
}
