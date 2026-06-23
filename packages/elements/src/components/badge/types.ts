import type { ThemeElementDefinition } from '@vuecs/core';

export type BadgeColor = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export type BadgeThemeClasses = {
    /** The pill element. */
    root: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        badge?: ThemeElementDefinition<BadgeThemeClasses>;
    }
}
