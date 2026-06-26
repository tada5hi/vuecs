import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    BreadcrumbItemThemeClasses,
    BreadcrumbSeparatorThemeClasses,
    BreadcrumbThemeClasses,
} from './types';

export const breadcrumbThemeDefaults: ComponentThemeDefinition<BreadcrumbThemeClasses> = {
    classes: {
        root: 'vc-breadcrumb',
        list: 'vc-breadcrumb-list',
        link: 'vc-breadcrumb-link',
        page: 'vc-breadcrumb-page',
        ellipsis: 'vc-breadcrumb-ellipsis',
    },
};

export const breadcrumbItemThemeDefaults: ComponentThemeDefinition<BreadcrumbItemThemeClasses> = { classes: { root: 'vc-breadcrumb-item' } };

export const breadcrumbSeparatorThemeDefaults: ComponentThemeDefinition<BreadcrumbSeparatorThemeClasses> = { classes: { root: 'vc-breadcrumb-separator' } };
