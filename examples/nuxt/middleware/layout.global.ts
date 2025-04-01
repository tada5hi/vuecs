/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { injectNavigationManager } from '@vuecs/navigation';

export default defineNuxtRouteMiddleware(async (route) => {
    const manager = injectNavigationManager();
    await manager.build({ path: route.fullPath });
});
