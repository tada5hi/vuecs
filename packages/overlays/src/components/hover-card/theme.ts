import type { ComponentThemeDefinition } from '@vuecs/core';
import type { HoverCardThemeClasses } from './types';

export const hoverCardThemeDefaults: ComponentThemeDefinition<HoverCardThemeClasses> = {
    classes: {
        trigger: 'vc-hover-card-trigger',
        content: 'vc-hover-card-content',
        arrow: 'vc-hover-card-arrow',
    },
};
