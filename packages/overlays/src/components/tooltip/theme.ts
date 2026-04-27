import type { ComponentThemeDefinition } from '@vuecs/core';
import type { TooltipThemeClasses } from './types';

export const tooltipThemeDefaults: ComponentThemeDefinition<TooltipThemeClasses> = {
    classes: {
        content: 'vc-tooltip-content',
        trigger: 'vc-tooltip-trigger',
        arrow: 'vc-tooltip-arrow',
    },
};
