import type { CoreOptions, ThemeElementDefinition  } from '@vuecs/core';

import '../assets/index.css';
import './vue';

export type TreeThemeClasses = {
    root: string,
    empty: string
};

export type TreeItemThemeClasses = {
    root: string,
    content: string,
    trigger: string,
    triggerIcon: string,
    rail: string,
    icon: string,
    label: string
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        tree?: ThemeElementDefinition<TreeThemeClasses>;
        treeItem?: ThemeElementDefinition<TreeItemThemeClasses>;
    }
}

export type Options = CoreOptions;
