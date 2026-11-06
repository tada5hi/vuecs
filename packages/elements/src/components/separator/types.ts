import type { ThemeElementDefinition } from '@vuecs/core';

export type SeparatorThemeClasses = {
    /** The separator element itself. */
    root: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        separator?: ThemeElementDefinition<SeparatorThemeClasses>;
    }
}
