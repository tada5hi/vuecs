/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {LayoutKey} from "../contants";
import {Store} from "vuex";
import {Route} from "vue-router";
import {NavigationComponentConfig} from "../type";

export async function layoutMiddleware({ store, route } : { store: Store<any>, route: Route }) {
    let navigationId : string | string[] | undefined;

    if(route.meta) {
        for (let i = 0; i < route.meta.length; i++) {
            if (
                LayoutKey.NAVIGATION_ID in route.meta[i] &&
                route.meta[i][LayoutKey.NAVIGATION_ID]
            ) {
                navigationId = route.meta[i][LayoutKey.NAVIGATION_ID]
            }
        }
    }

    if(typeof navigationId === 'undefined') {
        for(let i=0; i< route.matched.length; i++) {
            if (LayoutKey.NAVIGATION_ID in route.matched[i]) {
                // @ts-ignore
                navigationId = route.matched[i][LayoutKey.NAVIGATION_ID];
            }
        }
    }

    let components : Partial<NavigationComponentConfig>[] = [];

    if(typeof navigationId === 'string') {
        components.push({
            id: navigationId
        });
    }

    if(Array.isArray(navigationId)) {
        components = navigationId.map(id => {
            return {
                id
            }
        })
    }

    components.push({
        url: route.path
    })

    await store.dispatch('layout/initNavigation', {
        components
    });
}
