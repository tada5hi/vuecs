/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Store} from "vuex";
import {Route} from "vue-router";
import {NavigationComponentConfig} from "../type";

export async function layoutMiddleware(
    {
        store,
        route,
        metaKey
    } : {
        store: Store<any>,
        route: Route,
        metaKey: string
    }
) {
    let navigationId : string | string[] | undefined;

    if(route.meta) {
        for (let i = 0; i < route.meta.length; i++) {
            if (
                metaKey in route.meta[i] &&
                route.meta[i][metaKey]
            ) {
                navigationId = route.meta[i][metaKey]
            }
        }
    }

    if(typeof navigationId === 'undefined') {
        for(let i=0; i< route.matched.length; i++) {
            if (metaKey in route.matched[i]) {
                // @ts-ignore
                navigationId = route.matched[i][metaKey];
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
