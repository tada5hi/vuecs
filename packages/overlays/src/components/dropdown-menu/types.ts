import type { ThemeElementDefinition } from '@vuecs/core';

export type DropdownMenuThemeClasses = {
    /** Floating menu panel. */
    content: string;
    /** Trigger element that opens the menu. */
    trigger: string;
    /** Single menu entry. */
    item: string;
    /** Group label (non-interactive section heading). */
    label: string;
    /** Horizontal separator between items. */
    separator: string;
    /** Wrapping group element (purely semantic; renders a div by default). */
    group: string;
    /** Arrow / pointer (optional). */
    arrow: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        dropdownMenu?: ThemeElementDefinition<DropdownMenuThemeClasses>;
    }
}
