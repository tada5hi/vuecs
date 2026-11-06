import type { ThemeElementDefinition } from '@vuecs/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

export type AvatarThemeClasses = {
    /** The outer wrapper. */
    root: string;
    /** The `<img>` element wrapper. */
    image: string;
    /** Fallback element rendered when the image hasn't loaded (or failed). */
    fallback: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        avatar?: ThemeElementDefinition<AvatarThemeClasses>;
    }
}
