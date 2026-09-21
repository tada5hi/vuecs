import type { ComponentThemeDefinition } from '@vuecs/core';
import type { TreeItemThemeClasses, TreeThemeClasses } from './types';

export const treeThemeDefaults: ComponentThemeDefinition<TreeThemeClasses> = {
    classes: {
        root: 'vc-tree',
        empty: 'vc-tree-empty',
    },
};

export const treeItemThemeDefaults: ComponentThemeDefinition<TreeItemThemeClasses> = {
    classes: {
        root: 'vc-tree-item',
        content: 'vc-tree-item-content',
        trigger: 'vc-tree-item-trigger',
        triggerIcon: 'vc-tree-item-trigger-icon',
        icon: 'vc-tree-item-icon',
        label: 'vc-tree-item-label',
    },
};
