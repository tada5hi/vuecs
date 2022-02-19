/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Store } from 'vuex';
import Router, { Route } from 'vue-router';

declare module '*.vue' {
    import Vue from 'vue';

    export default Vue;
}

declare module 'vue/types/vue' {
    // Global properties can be declared
    // on the `VueConstructor` interface
    interface VueConstructor {
        $store: Store<any>,
        $router: Router
        $route: Route
    }

    interface Vue {
        $store: Store<any>,
        $router: Router
        $route: Route
    }
}
