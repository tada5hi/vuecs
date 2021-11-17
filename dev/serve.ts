import Vue, { VNode } from 'vue';
import {NavigationProvider} from "./module";
import Dev from './serve.vue';

import VueLayoutNavigation, {storePlugin} from '../src/entry.esm';
Vue.use(VueLayoutNavigation);

Vue.config.productionTip = false;

import Vuex from 'vuex';
import VueRouter from "vue-router";

Vue.use(Vuex);
Vue.use(VueRouter);

import Realm from './components/realm.vue';
import Info from './components/about.vue';
import About from './components/about.vue';

const router = new VueRouter({
    mode: "history",
    routes: [
        {path: '/', component: Info},
        {path: '/about', component: About},
        {path: '/admin/realms', component: Realm}
    ]
});

const store = new Vuex.Store({
    modules: {
        layout: storePlugin
    }
});

(store as any).$navigationProvider = new NavigationProvider();
(store as any).$router = router;

Promise.resolve()
    .then(() => store.dispatch('layout/initNavigation'));

new Vue({
    render: (h): VNode => h(Dev),
    store,
    router
}).$mount('#app');
