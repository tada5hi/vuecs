import type { ComponentThemeDefinition } from '@vuecs/core';
import type { DropdownMenuThemeClasses } from './types';

export const dropdownMenuThemeDefaults: ComponentThemeDefinition<DropdownMenuThemeClasses> = {
    classes: {
        content: 'vc-dropdown-content',
        trigger: 'vc-dropdown-trigger',
        item: 'vc-dropdown-item',
        checkboxItem: 'vc-dropdown-checkbox-item',
        radioItem: 'vc-dropdown-radio-item',
        radioGroup: 'vc-dropdown-radio-group',
        itemIndicator: 'vc-dropdown-item-indicator',
        label: 'vc-dropdown-label',
        separator: 'vc-dropdown-separator',
        group: 'vc-dropdown-group',
        subTrigger: 'vc-dropdown-sub-trigger',
        subContent: 'vc-dropdown-sub-content',
        arrow: 'vc-dropdown-arrow',
    },
};
