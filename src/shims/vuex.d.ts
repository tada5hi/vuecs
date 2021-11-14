import {AuthModuleInterface, LayoutProviderInterface} from "../type";
import VueRouter from "vue-router";

declare module 'vuex/types/index' {
    interface Store<S> {
        $auth: AuthModuleInterface,
        $router: VueRouter,
        $layoutProvider: LayoutProviderInterface
    }
}
