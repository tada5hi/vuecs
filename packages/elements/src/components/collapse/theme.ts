import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    CollapseContentThemeClasses,
    CollapseThemeClasses,
    CollapseTriggerThemeClasses,
} from './types';

export const collapseThemeDefaults: ComponentThemeDefinition<CollapseThemeClasses> = { classes: { root: 'vc-collapse' } };

export const collapseTriggerThemeDefaults: ComponentThemeDefinition<CollapseTriggerThemeClasses> = {
    classes: {
        root: 'vc-collapse-trigger',
        chevron: 'vc-collapse-chevron',
    },
};

export const collapseContentThemeDefaults: ComponentThemeDefinition<CollapseContentThemeClasses> = { classes: { root: 'vc-collapse-content' } };
