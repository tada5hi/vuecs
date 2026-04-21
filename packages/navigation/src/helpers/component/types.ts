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
};

declare module '@vuecs/core' {
    interface ThemeElements {
        navigation?: ThemeElementDefinition<NavigationThemeClasses>;
    }
}
