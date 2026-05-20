import type { ThemeElementDefinition } from '@vuecs/core';

export type CardVariant = 'outline' | 'soft' | 'elevated';
export type CardPadding = 'compact' | 'normal' | 'spacious';

export type CardThemeClasses = {
    /** The outer container. */
    root: string;
};

export type CardHeaderThemeClasses = {
    /** The header band. */
    root: string;
};

export type CardTitleThemeClasses = {
    /** The title text element. */
    root: string;
};

export type CardDescriptionThemeClasses = {
    /** The description text element. */
    root: string;
};

export type CardBodyThemeClasses = {
    /** The main content band. */
    root: string;
};

export type CardFooterThemeClasses = {
    /** The footer band. */
    root: string;
};

export type CardPlaceholderThemeClasses = {
    /** Outer card wrapper (`<div>`). */
    root: string;
    /** Wrapper around the cover-image placeholder. */
    image: string;
    /** Wrapper around the header line (typically a wide bar). */
    header: string;
    /** Wrapper around the body lines. */
    body: string;
    /** Wrapper around the footer block (typically two short bars). */
    footer: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        card?: ThemeElementDefinition<CardThemeClasses>;
        cardHeader?: ThemeElementDefinition<CardHeaderThemeClasses>;
        cardTitle?: ThemeElementDefinition<CardTitleThemeClasses>;
        cardDescription?: ThemeElementDefinition<CardDescriptionThemeClasses>;
        cardBody?: ThemeElementDefinition<CardBodyThemeClasses>;
        cardFooter?: ThemeElementDefinition<CardFooterThemeClasses>;
        cardPlaceholder?: ThemeElementDefinition<CardPlaceholderThemeClasses>;
    }
}
