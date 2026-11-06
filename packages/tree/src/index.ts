import type { Options } from './types';
import type { App, Component, Plugin } from 'vue';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';


import '../assets/index.css';

import './vue';
import { VCTree, VCTreeItem, VCTreeItemTrigger } from './components';

export * from './components';
export * from './composables';
export * from './theme';
export * from './types';
export * from './utils';

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);
    installConfigManager(app, options);

    Object.entries({
        VCTree,
        VCTreeItem,
        VCTreeItemTrigger,
    }).forEach(([name, component]) => {
        // `VCTree` / `VCTreeItem` are exported as generic-over-`Item`
        // function types; that cast isn't structurally a Vue `Component`,
        // but the runtime value still is. Cast back for registration —
        // identical at runtime.
        app.component(name, component as Component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
