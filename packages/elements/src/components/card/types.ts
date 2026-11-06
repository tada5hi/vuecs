import type { ThemeElementDefinition, VariantValues  } from '@vuecs/core';

import type { cardPlaceholderProps } from './props';
import type { ExtractPublicPropTypes } from 'vue';


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
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
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

/**
 * Context shared from `<VCCard>` to its descendant parts so that the
 * variant axes applied to the root (notably `padding`) propagate
 * automatically to header / body / footer / title / description without
 * the consumer repeating the prop on every child. Per-instance values
 * on a child still win over inherited ones.
 *
 * Optional — children render bare when mounted outside `<VCCard>` (for
 * unit tests or ad-hoc composition).
 */
export type CardContext = {
    themeVariant: () => VariantValues | undefined;
};

export type CardPlaceholderProps = ExtractPublicPropTypes<typeof cardPlaceholderProps>;
