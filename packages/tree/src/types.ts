import type { ThemeElementDefinition } from '@vuecs/core';

export type TreeThemeClasses = {
    root: string,
    empty: string
};

export type TreeItemThemeClasses = {
    root: string,
    content: string,
    trigger: string,
    triggerIcon: string,
    icon: string,
    label: string
};

declare module '@vuecs/core' {
    interface ThemeElements {
        tree?: ThemeElementDefinition<TreeThemeClasses>;
        treeItem?: ThemeElementDefinition<TreeItemThemeClasses>;
    }
}
