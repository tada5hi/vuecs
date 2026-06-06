import type { ThemeElementDefinition } from '@vuecs/core';

export type NavigationThemeClasses = {
    group: string;
    item: string;
    itemNested: string;
    separator: string;
    link: string;
    linkRoot: string;
    linkIcon: string;
    linkText: string;

    /** Group title that opens a submenu (Collapsible / NavigationMenu trigger). */
    trigger: string;
    /** Submenu panel (CollapsibleContent / NavigationMenuContent). */
    content: string;
    /** Edge-aware flyout host for the dropdown submenu (NavigationMenuViewport). */
    viewport: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        navigation?: ThemeElementDefinition<NavigationThemeClasses>;
    }
}
