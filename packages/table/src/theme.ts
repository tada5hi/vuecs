import type { ComponentThemeDefinition } from '@vuecs/core';
import type {
    TableBodyThemeClasses,
    TableCellThemeClasses,
    TableEmptyThemeClasses,
    TableExpandTriggerCellThemeClasses,
    TableExpandTriggerThemeClasses,
    TableFooterThemeClasses,
    TableHeadCellThemeClasses,
    TableHeaderThemeClasses,
    TableLoadingThemeClasses,
    TablePlaceholderThemeClasses,
    TableRowExpansionThemeClasses,
    TableRowThemeClasses,
    TableSortIndicatorsThemeClasses,
    TableThemeClasses,
} from './types';

export const tableThemeDefaults: ComponentThemeDefinition<TableThemeClasses> = {
    classes: {
        root: 'vc-table',
        scrollContainer: 'vc-table-scroll-container',
    },
};

export const tableHeaderThemeDefaults: ComponentThemeDefinition<TableHeaderThemeClasses> = { classes: { root: 'vc-table-header' } };

export const tableBodyThemeDefaults: ComponentThemeDefinition<TableBodyThemeClasses> = { classes: { root: 'vc-table-body' } };

export const tableFooterThemeDefaults: ComponentThemeDefinition<TableFooterThemeClasses> = { classes: { root: 'vc-table-footer' } };

export const tableRowThemeDefaults: ComponentThemeDefinition<TableRowThemeClasses> = { classes: { root: 'vc-table-row' } };

export const tableCellThemeDefaults: ComponentThemeDefinition<TableCellThemeClasses> = { classes: { root: 'vc-table-cell' } };

export const tableHeadCellThemeDefaults: ComponentThemeDefinition<TableHeadCellThemeClasses> = {
    classes: {
        root: 'vc-table-head-cell',
        sortIcon: 'vc-table-head-cell-sort-icon',
    },
};

export const tableEmptyThemeDefaults: ComponentThemeDefinition<TableEmptyThemeClasses> = { classes: { root: 'vc-table-empty' } };

export const tableLoadingThemeDefaults: ComponentThemeDefinition<TableLoadingThemeClasses> = {
    classes: {
        root: 'vc-table-loading',
        overlay: 'vc-table-loading-overlay',
    },
};

export const tablePlaceholderThemeDefaults: ComponentThemeDefinition<TablePlaceholderThemeClasses> = {
    classes: {
        root: 'vc-table-placeholder',
        header: 'vc-table-placeholder-header',
        body: 'vc-table-placeholder-body',
        footer: 'vc-table-placeholder-footer',
        row: 'vc-table-placeholder-row',
        cell: 'vc-table-placeholder-cell',
    },
};

export const tableRowExpansionThemeDefaults: ComponentThemeDefinition<TableRowExpansionThemeClasses> = {
    classes: {
        root: 'vc-table-row-expansion',
        cell: 'vc-table-row-expansion-cell',
        panel: 'vc-table-row-expansion-panel',
        panelInner: 'vc-table-row-expansion-panel-inner',
    },
};

export const tableExpandTriggerThemeDefaults: ComponentThemeDefinition<TableExpandTriggerThemeClasses> = {
    classes: {
        root: 'vc-table-expand-trigger',
        icon: 'vc-table-expand-trigger-icon',
    },
};

export const tableExpandTriggerCellThemeDefaults: ComponentThemeDefinition<TableExpandTriggerCellThemeClasses> = { classes: { root: 'vc-table-expand-trigger-cell' } };

export const tableSortIndicatorsThemeDefaults: ComponentThemeDefinition<TableSortIndicatorsThemeClasses> = {
    classes: {
        root: 'vc-table-sort-indicators',
        label: 'vc-table-sort-indicators-label',
        empty: 'vc-table-sort-indicators-empty',
        chip: 'vc-table-sort-indicators-chip',
        chipToggle: 'vc-table-sort-indicators-chip-toggle',
        chipPosition: 'vc-table-sort-indicators-chip-position',
        chipLabel: 'vc-table-sort-indicators-chip-label',
        chipArrow: 'vc-table-sort-indicators-chip-arrow',
        chipRemove: 'vc-table-sort-indicators-chip-remove',
        addWrapper: '',
        add: 'vc-table-sort-indicators-add',
        clear: 'vc-table-sort-indicators-clear',
    },
};
