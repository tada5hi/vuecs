/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Route } from 'vue-router';
import { build } from '../store';
import { ComponentsActive } from '../type';

export async function middleware(
    {
        route,
        metaKey,
    } : {
        route: Route,
        metaKey: string
    },
) {
    let data : string | string[] | undefined;

    if (route.meta) {
        for (let i = 0; i < route.meta.length; i++) {
            if (
                metaKey in route.meta[i] &&
                route.meta[i][metaKey]
            ) {
                data = route.meta[i][metaKey];
            }
        }
    }

    if (typeof data === 'undefined') {
        for (let i = 0; i < route.matched.length; i++) {
            if (Object.prototype.hasOwnProperty.call(route.matched[i], metaKey)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data = route.matched[i][metaKey];
            }
        }
    }

    const componentsActive : ComponentsActive = {};

    if (typeof data === 'string') {
        componentsActive[0] = {
            id: data,
        };
    }

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            componentsActive[i] = {
                id: data[i],
            };
        }
    }

    let componentSize = Object.keys(componentsActive).length;
    const isRootPath = route.path === '/';

    if (
        isRootPath &&
        componentSize > 0
    ) {
        componentsActive[0].rootLink = true;
    }

    if (componentSize === 0) {
        componentsActive[0] = {
            rootLink: true,
            url: route.fullPath,
        };

        componentSize++;
    }

    if (
        componentSize === 1 &&
        componentsActive[0].url !== route.path
    ) {
        componentsActive[1] = {
            url: route.path,
        };
    }

    await build({
        url: route.fullPath,
        activeComponents: componentsActive,
    });
}
