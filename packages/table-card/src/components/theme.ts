import type { ComponentThemeDefinition } from '@vuecs/core';
import type { TableCardThemeClasses } from '../types';

export const tableCardThemeDefaults: ComponentThemeDefinition<TableCardThemeClasses> = {
    classes: {
        root: 'vc-table-card',
        header: 'vc-table-card-header',
        heading: 'vc-table-card-heading',
        title: 'vc-table-card-title',
        description: 'vc-table-card-description',
        toolbar: 'vc-table-card-toolbar',
        search: 'vc-table-card-search',
        actions: 'vc-table-card-actions',
        body: 'vc-table-card-body',
        main: 'vc-table-card-main',
        aside: 'vc-table-card-aside',
        footer: 'vc-table-card-footer',
    },
};
