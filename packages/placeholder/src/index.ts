import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';
import type { Options } from './types';

import '../assets/index.css';
import './vue';

import {
    VCPlaceholder,
    VCPlaceholderWrapper,
} from './components';

export * from './components';
export * from './theme';
export * from './types';

export function install(app: App, options: Options = {}): void {
    installThemeManager(app, options);
    installDefaultsManager(app, options);

    Object.entries({
        VCPlaceholder,
        VCPlaceholderWrapper,
    }).forEach(([name, component]) => {
        app.component(name, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
