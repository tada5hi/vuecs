import VueRouter from 'vue-router';
import { NavigationProviderInterface } from '../type';

declare module 'vuex/types/index' {
    interface Store<S> {
        $router: VueRouter,
        $layoutNavigationProvider: NavigationProviderInterface
    }
}
