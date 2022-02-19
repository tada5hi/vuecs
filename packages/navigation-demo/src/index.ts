/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { VNode } from 'vue';
import { NavigationProvider } from './module';
import Dev from './serve.vue';

import '../assets/items.css';

import VueLayoutNavigation, { storePlugin } from '@vue-layout/navigation';

import Vuex from 'vuex';
import VueRouter from 'vue-router';

import About from './components/about.vue';
import Home from './components/home.vue';
import Realm from './components/realm.vue';
import Settings from './components/settings.vue';

Vue.use(VueLayoutNavigation);

Vue.config.productionTip = false;

Vue.use(Vuex);
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

const store = new Vuex.Store({
    modules: {
        layout: storePlugin,
    },
});

(store as any).$layoutNavigationProvider = new NavigationProvider();
(store as any).$router = router;

Promise.resolve()
    .then(() => store.dispatch('layout/initNavigation'));

new Vue({
    render: (h): VNode => h(Dev),
    store,
    router,
}).$mount('#app');
