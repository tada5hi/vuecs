import {NavigationProviderInterface} from "../type";
import VueRouter from "vue-router";

declare module 'vuex/types/index' {
    interface Store<S> {
        $router: VueRouter,
        $layoutNavigationProvider: NavigationProviderInterface
    }
}
