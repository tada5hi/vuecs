/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { build, createNavigation } from '@vue-layout/navigation';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { Provider } from './module';

import Dev from './serve.vue';

import About from './components/about.vue';
import Home from './components/home.vue';
import Realm from './components/realm.vue';
import Settings from './components/settings.vue';

const app = createApp(Dev);

const layoutNavigation = createNavigation({
    provider: new Provider(),
});

app.use(layoutNavigation);

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
    await build({ url });

    app.mount('#app');
})();
