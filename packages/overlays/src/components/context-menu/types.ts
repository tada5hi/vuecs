import type { ThemeElementDefinition } from '@vuecs/core';

export type ContextMenuThemeClasses = {
    /** Floating menu panel. */
    content: string;
    /** Right-click trigger area. */
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
    /** Wrapping group element. */
    group: string;
    /** Sub-menu trigger (item that opens a nested menu). */
    subTrigger: string;
    /** Sub-menu content panel. */
    subContent: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        contextMenu?: ThemeElementDefinition<ContextMenuThemeClasses>;
    }
}
