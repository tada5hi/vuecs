import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    PlaceholderCardThemeClasses,
    PlaceholderTableThemeClasses,
    PlaceholderThemeClasses,
    PlaceholderWrapperThemeClasses,
} from './types';

export const placeholderThemeDefaults: ComponentThemeDefinition<PlaceholderThemeClasses> = {
    classes: {
        root: 'vc-placeholder',
        wave: 'vc-placeholder-wave',
        glow: 'vc-placeholder-glow',
    },
    variants: {
        size: {
            xs: { root: 'vc-placeholder-xs' },
            sm: { root: 'vc-placeholder-sm' },
            md: { root: 'vc-placeholder-md' },
            lg: { root: 'vc-placeholder-lg' },
            xl: { root: 'vc-placeholder-xl' },
        },
    },
    defaultVariants: { size: 'md' },
};

export const placeholderTableThemeDefaults: ComponentThemeDefinition<PlaceholderTableThemeClasses> = {
    classes: {
        root: 'vc-placeholder-table',
        header: 'vc-placeholder-table-header',
        body: 'vc-placeholder-table-body',
        footer: 'vc-placeholder-table-footer',
        row: 'vc-placeholder-table-row',
        cell: 'vc-placeholder-table-cell',
    },
};

export const placeholderCardThemeDefaults: ComponentThemeDefinition<PlaceholderCardThemeClasses> = {
    classes: {
        root: 'vc-placeholder-card',
        image: 'vc-placeholder-card-image',
        header: 'vc-placeholder-card-header',
        body: 'vc-placeholder-card-body',
        footer: 'vc-placeholder-card-footer',
    },
};

export const placeholderWrapperThemeDefaults: ComponentThemeDefinition<PlaceholderWrapperThemeClasses> = { classes: { root: 'vc-placeholder-wrapper' } };
