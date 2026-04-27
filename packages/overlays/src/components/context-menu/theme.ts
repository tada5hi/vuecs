import type { ComponentThemeDefinition } from '@vuecs/core';
import type { ContextMenuThemeClasses } from './types';

export const contextMenuThemeDefaults: ComponentThemeDefinition<ContextMenuThemeClasses> = {
    classes: {
        content: 'vc-context-menu-content',
        trigger: 'vc-context-menu-trigger',
        item: 'vc-context-menu-item',
        checkboxItem: 'vc-context-menu-checkbox-item',
        radioItem: 'vc-context-menu-radio-item',
        radioGroup: 'vc-context-menu-radio-group',
        itemIndicator: 'vc-context-menu-item-indicator',
        label: 'vc-context-menu-label',
        separator: 'vc-context-menu-separator',
        group: 'vc-context-menu-group',
        subTrigger: 'vc-context-menu-sub-trigger',
        subContent: 'vc-context-menu-sub-content',
    },
};
