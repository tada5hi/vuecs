import {AuthModule} from "../type";
import VueRouter from "vue-router";

declare module 'vuex/types/index' {
    interface Store<S> {
        $auth: AuthModule,
        $router: VueRouter
    }
}
