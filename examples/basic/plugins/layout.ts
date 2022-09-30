/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationStore, createPlugin } from '@vue-layout/basic';
import { defineNuxtPlugin, useState } from '#app';
import { navigationProvider } from '~/config/layout';

export default defineNuxtPlugin((ctx) => {
    const navigationStore = useState<NavigationStore>(() => ({
        items: [],
        itemsActive: [],
    }));

    ctx.vueApp.use(createPlugin({
        navigationStore,
        navigationProvider,
        presets: [
            'bootstrapV4',
            'fontAwesome',
        ],
    }));
});
