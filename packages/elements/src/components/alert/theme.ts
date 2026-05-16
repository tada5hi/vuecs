import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    AlertDescriptionThemeClasses,
    AlertThemeClasses,
    AlertTitleThemeClasses,
} from './types';

export const alertThemeDefaults: ComponentThemeDefinition<AlertThemeClasses> = {
    classes: {
        root: 'vc-alert',
        icon: 'vc-alert-icon',
        content: 'vc-alert-content',
        closeIcon: 'vc-alert-close-icon',
        close: 'vc-alert-close',
    },
};

export const alertTitleThemeDefaults: ComponentThemeDefinition<AlertTitleThemeClasses> = { classes: { root: 'vc-alert-title' } };

export const alertDescriptionThemeDefaults: ComponentThemeDefinition<AlertDescriptionThemeClasses> = { classes: { root: 'vc-alert-description' } };
