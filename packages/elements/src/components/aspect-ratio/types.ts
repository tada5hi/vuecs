import type { ThemeElementDefinition } from '@vuecs/core';

export type AspectRatioThemeClasses = {
    /** The outer wrapper that maintains the ratio. */
    root: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        aspectRatio?: ThemeElementDefinition<AspectRatioThemeClasses>;
    }
}
