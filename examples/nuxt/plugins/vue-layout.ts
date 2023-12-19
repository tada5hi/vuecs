/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { applyPluginBaseOptions } from '@vuecs/core';
import type { PluginBaseOptions } from '@vuecs/core';
import bootstrapV5 from '@vuecs/preset-bootstrap-v5';
import fontAwesome from '@vuecs/preset-font-awesome';

import installCountdown from '@vuecs/countdown';
import installFormControl from '@vuecs/form-controls';
import installGravatar from '@vuecs/gravatar';
import installLink from '@vuecs/link';
import installNavigation from '@vuecs/navigation';
import '@vuecs/pagination/../dist/index.css';
import installPagination from '@vuecs/pagination';
import installTimeago from '@vuecs/timeago';
import { defineNuxtPlugin } from '#app';
import { navigationProvider } from '~/config/layout';

export default defineNuxtPlugin((ctx) => {
    const baseOptions : PluginBaseOptions = {
        presets: {
            bootstrapV5,
            fontAwesome,
        },
    };

    applyPluginBaseOptions(ctx.vueApp, baseOptions);

    ctx.vueApp.use(installCountdown);
    ctx.vueApp.use(installFormControl);
    ctx.vueApp.use(installGravatar);
    ctx.vueApp.use(installLink);
    ctx.vueApp.use(installTimeago);

    ctx.vueApp.use(installNavigation, {
        provider: navigationProvider,
    });

    ctx.vueApp.use(installPagination);
});
