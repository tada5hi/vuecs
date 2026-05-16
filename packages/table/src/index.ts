import type { App, Plugin } from 'vue';
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
    VCTableFooter,
    VCTableHeadCell,
    VCTableHeader,
    VCTableLoading,
    VCTableRow,
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
        VCTableHeader,
        VCTableBody,
        VCTableFooter,
        VCTableRow,
        VCTableCell,
        VCTableHeadCell,
        VCTableEmpty,
        VCTableLoading,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
