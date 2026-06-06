/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { inject, provide } from '@vuecs/core';
import type { App } from 'vue';
import { NavigationRegistry } from './module';

const sym = Symbol.for('VCNavigationRegistry');

export function tryInjectNavigationRegistry(app?: App): NavigationRegistry | undefined {
    return inject<NavigationRegistry>(sym, app);
}

export function injectNavigationRegistry(app?: App): NavigationRegistry {
    const instance = tryInjectNavigationRegistry(app);
    if (!instance) {
        throw new Error('A navigation registry has not been provided.');
    }

    return instance;
}

export function provideNavigationRegistry(
    registry: NavigationRegistry = new NavigationRegistry(),
    app?: App,
): NavigationRegistry {
    provide(sym, registry, app);
    return registry;
}
