import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    CardBodyThemeClasses,
    CardDescriptionThemeClasses,
    CardFooterThemeClasses,
    CardHeaderThemeClasses,
    CardThemeClasses,
    CardTitleThemeClasses,
} from './types';

export const cardThemeDefaults: ComponentThemeDefinition<CardThemeClasses> = { classes: { root: 'vc-card' } };

export const cardHeaderThemeDefaults: ComponentThemeDefinition<CardHeaderThemeClasses> = { classes: { root: 'vc-card-header' } };

export const cardTitleThemeDefaults: ComponentThemeDefinition<CardTitleThemeClasses> = { classes: { root: 'vc-card-title' } };

export const cardDescriptionThemeDefaults: ComponentThemeDefinition<CardDescriptionThemeClasses> = { classes: { root: 'vc-card-description' } };

export const cardBodyThemeDefaults: ComponentThemeDefinition<CardBodyThemeClasses> = { classes: { root: 'vc-card-body' } };

export const cardFooterThemeDefaults: ComponentThemeDefinition<CardFooterThemeClasses> = { classes: { root: 'vc-card-footer' } };
