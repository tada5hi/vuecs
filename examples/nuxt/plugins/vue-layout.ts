/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import vuecs from '@vuecs/core';
import bootstrapV5 from '@vuecs/theme-bootstrap-v5';
import fontAwesome from '@vuecs/theme-font-awesome';

import installCountdown from '@vuecs/countdown';
import installFormControl from '@vuecs/form-controls';
import installGravatar from '@vuecs/gravatar';
import installLink from '@vuecs/link';
import { install as installNavigation } from '@vuecs/navigation';
import '@vuecs/list-controls/../dist/style.css';
import '@vuecs/navigation/../dist/style.css';
import '@vuecs/pagination/../dist/style.css';
import installPagination from '@vuecs/pagination';
import installTimeago from '@vuecs/timeago';
import { de } from 'date-fns/locale';
import { defineNuxtPlugin } from '#app';
import { findNavigationItems } from '~/config/layout';

export default defineNuxtPlugin((ctx) => {
    ctx.vueApp.use(vuecs, { themes: [bootstrapV5(), fontAwesome()] });

    ctx.vueApp.use(installCountdown);
    ctx.vueApp.use(installFormControl);
    ctx.vueApp.use(installGravatar);
    ctx.vueApp.use(installLink);
    ctx.vueApp.use(installTimeago, { locales: { de } });

    installNavigation(ctx.vueApp, {
        items: ({
            level,
            parent,
        }) => findNavigationItems(level, parent),
    });

    ctx.vueApp.use(installPagination);
});
