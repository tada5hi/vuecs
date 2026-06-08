/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import vuecs from '@vuecs/core';
import tailwind from '@vuecs/theme-tailwind';
import fontAwesomeIcons from '@vuecs/icons-font-awesome';
import { addCollection } from '@iconify/vue';
import type { IconifyJSON } from '@iconify/vue';
import faSolid from '@iconify-json/fa6-solid/icons.json';

import installButton from '@vuecs/button';
import installCountdown from '@vuecs/countdown';
import installElements from '@vuecs/elements';
import installFormControl from '@vuecs/forms';
import installGravatar from '@vuecs/gravatar';
import installIcon from '@vuecs/icon';
import installLink from '@vuecs/link';
import installList from '@vuecs/list';
import { install as installNavigation } from '@vuecs/navigation';
import installOverlays from '@vuecs/overlays';
import installPagination from '@vuecs/pagination';
import installPlaceholder from '@vuecs/placeholder';
import installTimeago from '@vuecs/timeago';
import { de, fr } from 'date-fns/locale';
import { defineNuxtPlugin } from '#app';

// Register the Font Awesome 6 Solid collection with Iconify so <VCIcon>
// can resolve the names that @vuecs/icons-font-awesome provides
// (e.g. 'fa6-solid:chevron-left'). For Nuxt apps we recommend @nuxt/icon
// for SSR support; this manual addCollection() is the no-extra-module
// path used here for simplicity.
addCollection(faSolid as IconifyJSON);

export default defineNuxtPlugin((ctx) => {
    ctx.vueApp.use(vuecs, {
        themes: [tailwind()],
        icons: [fontAwesomeIcons()],
    });

    ctx.vueApp.use(installIcon);
    ctx.vueApp.use(installButton);
    ctx.vueApp.use(installCountdown);
    ctx.vueApp.use(installElements);
    ctx.vueApp.use(installFormControl);
    ctx.vueApp.use(installGravatar);
    ctx.vueApp.use(installLink);
    ctx.vueApp.use(installList);
    // Keyed by the BCP-47 tags the locale switcher emits so date-fns
    // localizes the relative-time output. The active locale comes from
    // @vuecs/nuxt's cookie-backed locale plugin (Config['locale']).
    ctx.vueApp.use(installTimeago, { locales: { 'de-DE': de, 'fr-FR': fr } });

    // Registry-only install — no items here. Each <VCNavItems> owns its
    // items via :data; navs opt into publishing via registry + registry-id.
    installNavigation(ctx.vueApp, {});

    ctx.vueApp.use(installPagination);
    ctx.vueApp.use(installPlaceholder);
    ctx.vueApp.use(installOverlays);
});
