import type { ThemeElementDefinition } from '@vuecs/core';

export type DropdownMenuThemeClasses = {
    /** Floating menu panel. */
    content: string;
    /** Trigger element that opens the menu. */
    trigger: string;
    /** Single menu entry. */
    item: string;
    /** Checkbox menu entry. */
    checkboxItem: string;
    /** Radio menu entry. */
    radioItem: string;
    /** Wrapping radio group. */
    radioGroup: string;
    /** Indicator inside a checkbox / radio item (renders only when checked). */
    itemIndicator: string;
    /** Group label (non-interactive section heading). */
    label: string;
    /** Horizontal separator between items. */
    separator: string;
    /** Wrapping group element (purely semantic; renders a div by default). */
    group: string;
    /** Sub-menu trigger (item that opens a nested menu). */
    subTrigger: string;
    /** Sub-menu content panel. */
    subContent: string;
    /** Arrow / pointer (optional). */
    arrow: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        dropdownMenu?: ThemeElementDefinition<DropdownMenuThemeClasses>;
    }
}
