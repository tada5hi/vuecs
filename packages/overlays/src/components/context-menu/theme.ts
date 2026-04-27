import type { ComponentThemeDefinition } from '@vuecs/core';
import type { ContextMenuThemeClasses } from './types';

export const contextMenuThemeDefaults: ComponentThemeDefinition<ContextMenuThemeClasses> = {
    classes: {
        content: 'vc-context-menu-content',
        trigger: 'vc-context-menu-trigger',
        item: 'vc-context-menu-item',
        label: 'vc-context-menu-label',
        separator: 'vc-context-menu-separator',
        group: 'vc-context-menu-group',
    },
};
