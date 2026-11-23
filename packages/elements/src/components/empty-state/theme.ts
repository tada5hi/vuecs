import type { ComponentThemeDefinition } from '@vuecs/core';
import type { EmptyStateThemeClasses } from './types';

export const emptyStateThemeDefaults: ComponentThemeDefinition<EmptyStateThemeClasses> = {
    classes: {
        root: 'vc-empty-state',
        icon: 'vc-empty-state-icon',
        title: 'vc-empty-state-title',
        description: 'vc-empty-state-description',
        action: 'vc-empty-state-action',
    },
};
