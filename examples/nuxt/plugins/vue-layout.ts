/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PluginBaseOptions } from '@vue-layout/core';
import type { NavigationStore } from '@vue-layout/navigation';
import bootstrap from '@vue-layout/preset-bootstrap-v5';
import fontAwesome from '@vue-layout/preset-font-awesome';

import installCountdown from '@vue-layout/countdown';
import installFormControl from '@vue-layout/form-controls';
import installGravatar from '@vue-layout/gravatar';
import installNavigation from '@vue-layout/navigation';
import installPagination from '@vue-layout/pagination';
import installTimeago from '@vue-layout/timeago';
import { defineNuxtPlugin, useState } from '#app';
import { navigationProvider } from '~/config/layout';

export default defineNuxtPlugin((ctx) => {
    const baseOptions : PluginBaseOptions = {
        presets: {
            bootstrapV5: bootstrap,
            fontAwesome,
        },
    };

    ctx.vueApp.use(installCountdown, baseOptions);
    ctx.vueApp.use(installFormControl, baseOptions);
    ctx.vueApp.use(installGravatar, baseOptions);
    ctx.vueApp.use(installTimeago);

    const navigationStore = useState<NavigationStore>(() => ({
        items: [],
        itemsActive: [],
    }));

    ctx.vueApp.use(installNavigation, {
        ...baseOptions,
        store: navigationStore,
        provider: navigationProvider,
    });

    ctx.vueApp.use(installPagination, baseOptions);
});
