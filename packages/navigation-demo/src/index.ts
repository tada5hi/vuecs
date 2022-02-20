/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { VNode } from 'vue';

import '@vue-layout/navigation/dist/index.min.css';
import VueLayoutNavigation, { buildNavigation, useProvider } from '@vue-layout/navigation';

import VueRouter from 'vue-router';

import { NavigationProvider } from './module';

import Dev from './serve.vue';

import About from './components/about.vue';
import Home from './components/home.vue';
import Realm from './components/realm.vue';
import Settings from './components/settings.vue';

const provider = new NavigationProvider();

useProvider(provider);

Vue.use(VueLayoutNavigation);
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/about', component: About },
        { path: '/settings', component: Settings },
        { path: '/admin/realms', component: Realm },
    ],
});

(async () => {
    const instance = new Vue({
        render: (h): VNode => h(Dev),
        router,
    });

    const url = (instance.$router as any)?.history?.current?.fullPath;
    await buildNavigation({ url });

    instance.$mount('#app');
})();
