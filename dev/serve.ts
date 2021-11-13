import Vue, { VNode } from 'vue';
import Dev from './serve.vue';
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call
import VueLayoutNavigation, {Layout, setMainNavComponents, storePlugin} from '../src/entry.esm';
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

setMainNavComponents([
    {
        id: 'default',
        name: 'Home',
        icon: 'fa fa-home',
    },
    {
        id: 'admin',
        name: 'Admin',
        icon: 'fas fa-cog',
        [Layout.REQUIRED_LOGGED_IN_KEY]: true,
        [Layout.REQUIRED_PERMISSIONS_KEY]: []
    }
]);

store.dispatch('layout/update', {type: 'main'}).then(r => r);

new Vue({
    render: (h): VNode => h(Dev),
    store
}).$mount('#app');
