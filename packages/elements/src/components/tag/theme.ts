import type { ComponentThemeDefinition } from '@vuecs/core';
import type { TagThemeClasses, TagsThemeClasses } from './types';

export const tagThemeDefaults: ComponentThemeDefinition<TagThemeClasses> = {
    classes: {
        root: 'vc-tag',
        icon: 'vc-tag-icon',
        remove: 'vc-tag-remove',
    },
};

export const tagsThemeDefaults: ComponentThemeDefinition<TagsThemeClasses> = {
    classes: {
        root: 'vc-tags',
        item: 'vc-tags-item',
    },
};
