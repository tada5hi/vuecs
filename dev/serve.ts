import Vue, { VNode } from 'vue';
import {LayoutProvider} from "./module";
import Dev from './serve.vue';

import VueLayoutNavigation, {storePlugin} from '../src/entry.esm';
Vue.use(VueLayoutNavigation);

Vue.config.productionTip = false;

import Vuex from 'vuex';
import VueRouter from "vue-router";

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store({
    modules: {
        layout: storePlugin
    }
});

(store as any).$layoutProvider = new LayoutProvider();

store.dispatch('layout/init', {level: 'level-0'}).then(r => r);

new Vue({
    render: (h): VNode => h(Dev),
    store
}).$mount('#app');
