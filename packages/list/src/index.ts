import type { App, Plugin } from 'vue';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { CoreOptions } from '@vuecs/core';

import './vue';
import {
    VCList,
    VCListBody,
    VCListFooter,
    VCListHeader,
    VCListItem,
    VCListLoading,
    VCListNoMore,
} from './components';

export * from './components';

export type Options = CoreOptions;

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);
    installConfigManager(app, options);

    Object.entries({
        VCList,
        VCListHeader,
        VCListBody,
        VCListItem,
        VCListFooter,
        VCListLoading,
        VCListNoMore,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
