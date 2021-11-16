/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {Context} from "@nuxt/types";
import {LayoutKey} from "../contants";

export default async function layoutMiddleware({ store, route } : Context) {
    const key = LayoutKey.NAVIGATION_ID;
    let navigationId : string | undefined;

    if(route.meta) {
        for (let i = 0; i < route.meta.length; i++) {
            if (key in route.meta[i] && route.meta[i][key]) {
                navigationId = route.meta[i][key]
            }
        }
    }

    if(typeof navigationId === 'undefined') {
        for(let i=0; i< route.matched.length; i++) {
            if (key in route.matched[i]) {
                // @ts-ignore
                navigationId = route.matched[i][key];
            }
        }
    }

    // todo: this should be done for all levels :)
    await store.dispatch('layout/selectComponent', {
        level: 0,
        component: {
            id: navigationId
        }
    });
}
