import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
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
        shape: {
            rect: { root: '' },
            pill: { root: 'vc-placeholder-pill' },
            circle: { root: 'vc-placeholder-circle' },
        },
    },
    defaultVariants: { size: 'md', shape: 'rect' },
};

export const placeholderWrapperThemeDefaults: ComponentThemeDefinition<PlaceholderWrapperThemeClasses> = { classes: { root: 'vc-placeholder-wrapper' } };
