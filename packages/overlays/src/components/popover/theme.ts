import type { ComponentThemeDefinition } from '@vuecs/core';
import type { PopoverThemeClasses } from './types';

export const popoverThemeDefaults: ComponentThemeDefinition<PopoverThemeClasses> = {
    classes: {
        content: 'vc-popover-content',
        trigger: 'vc-popover-trigger',
        arrow: 'vc-popover-arrow',
        close: 'vc-popover-close',
    },
};
