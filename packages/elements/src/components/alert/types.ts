import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

export type AlertColor = 'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'solid' | 'soft' | 'outline';
export type AlertSize = 'sm' | 'md' | 'lg';

export type AlertThemeClasses = {
    /** Outer container. */
    root: string;
    /** Icon slot wrapper (left of title/description). */
    icon: string;
    /** Title + description column. */
    content: string;
    /** Dismiss button — slotless `<VCAlertClose />` corner-X form. */
    closeIcon: string;
    /** Dismiss button — labeled-text form. */
    close: string;
};

export type AlertTitleThemeClasses = {
    /** The title element. */
    root: string;
};

export type AlertDescriptionThemeClasses = {
    /** The description element. */
    root: string;
};

export type AlertDefaults = {
    /** Color-derived default icons. Empty string = no icon for that color (primary / neutral default to no icon). */
    primaryIcon: string;
    neutralIcon: string;
    infoIcon: string;
    successIcon: string;
    warningIcon: string;
    errorIcon: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        alert?: ThemeElementDefinition<AlertThemeClasses>;
        alertTitle?: ThemeElementDefinition<AlertTitleThemeClasses>;
        alertDescription?: ThemeElementDefinition<AlertDescriptionThemeClasses>;
    }
    interface ComponentDefaults {
        alert?: ComponentDefaultValues<AlertDefaults>;
    }
}
