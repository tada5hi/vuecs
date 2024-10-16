/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { inject, provide } from '@vuecs/core';
import type { App } from 'vue';
import type { NavigationManager } from './module';

const sym = Symbol.for('VCNavigationManager');

export function injectNavigationManager(app?: App) : NavigationManager {
    const instance = inject<NavigationManager>(sym, app);
    if (!instance) {
        throw new Error('A navigation provider has not been provided.');
    }

    return instance;
}

export function provideNavigationManager(
    manager: NavigationManager,
    app?: App,
) {
    provide(sym, manager, app);
}
