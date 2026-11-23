import type { App, Component, Plugin } from 'vue';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { Options } from './types';

import './vue';

import { VCTableCard } from './components';

export * from './components';
export * from './types';

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);

    // `VCTableCard` is exported as a generic-over-`Row` function type; the
    // runtime value is still a Vue component. Cast back for registration.
    app.component('VCTableCard', VCTableCard as Component);
}

export default { install } satisfies Plugin<[Options?]>;
