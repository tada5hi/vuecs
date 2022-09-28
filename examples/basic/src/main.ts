/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { buildNavigation, createPlugin } from '@vue-layout/basic';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { navigationProvider } from './module';

import Dev from './serve.vue';

import About from './components/about.vue';
import Home from './components/home.vue';
import Realm from './components/realm.vue';
import Settings from './components/settings.vue';

const app = createApp(Dev);

const navigation = createPlugin({
    navigationProvider,
});
app.use(navigation);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/about', component: About },
        { path: '/settings', component: Settings },
        { path: '/admin/realms', component: Realm },
    ],
});
app.use(router);

(async () => {
    const url = router?.currentRoute?.value?.fullPath;
    await buildNavigation({ url });

    app.mount('#app');
})();
