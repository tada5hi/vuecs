import type { ComponentThemeDefinition } from '@vuecs/core';
import type { DropdownMenuThemeClasses } from './types';

export const dropdownMenuThemeDefaults: ComponentThemeDefinition<DropdownMenuThemeClasses> = {
    classes: {
        content: 'vc-dropdown-content',
        trigger: 'vc-dropdown-trigger',
        item: 'vc-dropdown-item',
        label: 'vc-dropdown-label',
        separator: 'vc-dropdown-separator',
        group: 'vc-dropdown-group',
        arrow: 'vc-dropdown-arrow',
    },
};
