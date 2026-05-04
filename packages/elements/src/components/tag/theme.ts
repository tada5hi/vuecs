import type { ComponentThemeDefinition } from '@vuecs/core';
import type { TagListThemeClasses, TagThemeClasses } from './types';

export const tagThemeDefaults: ComponentThemeDefinition<TagThemeClasses> = {
    classes: {
        root: 'vc-tag',
        icon: 'vc-tag-icon',
        remove: 'vc-tag-remove',
    },
};

export const tagListThemeDefaults: ComponentThemeDefinition<TagListThemeClasses> = {
    classes: {
        root: 'vc-tag-list',
        item: 'vc-tag-list-item',
    },
};
