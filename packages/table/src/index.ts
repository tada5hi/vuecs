import type { App, Component, Plugin } from 'vue';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { CoreOptions } from '@vuecs/core';

import '../assets/index.css';
import './defaults';
import './vue';

import {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableEmpty,
    VCTableExpandTrigger,
    VCTableFooter,
    VCTableHeadCell,
    VCTableHeader,
    VCTableLite,
    VCTableLoading,
    VCTablePlaceholder,
    VCTableRow,
    VCTableRowExpansion,
    VCTableSortIndicators,
} from './components';

export * from './components';
export * from './composables';
export * from './theme';
export * from './types';
export * from './utils';
export type * from './defaults';

export type Options = CoreOptions;

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);

    Object.entries({
        VCTable,
        VCTableLite,
        VCTableHeader,
        VCTableBody,
        VCTableFooter,
        VCTableRow,
        VCTableCell,
        VCTableHeadCell,
        VCTableEmpty,
        VCTableLoading,
        VCTablePlaceholder,
        VCTableSortIndicators,
        VCTableExpandTrigger,
        VCTableRowExpansion,
    }).forEach(([name, component]) => {
        // `VCTable` / `VCTableLite` are exported as generic-over-`Row`
        // function types (issue #1601); that cast isn't structurally a
        // Vue `Component`, but the runtime value still is. Cast back for
        // registration — identical at runtime.
        app.component(name, component as Component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
