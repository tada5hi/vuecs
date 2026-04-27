import type { ThemeElementDefinition } from '@vuecs/core';

export type ContextMenuThemeClasses = {
    /** Floating menu panel. */
    content: string;
    /** Right-click trigger area. */
    trigger: string;
    /** Single menu entry. */
    item: string;
    /** Group label (non-interactive section heading). */
    label: string;
    /** Horizontal separator between items. */
    separator: string;
    /** Wrapping group element. */
    group: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        contextMenu?: ThemeElementDefinition<ContextMenuThemeClasses>;
    }
}
