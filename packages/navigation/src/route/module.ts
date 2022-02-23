/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { build } from '../store';
import { Component } from '../type';
import { RouteBuildContext } from './type';

export async function buildWithRoute({ route, metaKey }: RouteBuildContext) {
    let data : unknown;

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

    const componentsActive : Component[] = [];

    if (typeof data === 'string') {
        componentsActive.push({
            tier: 0,
            id: data,
        });
    }

    if (typeof data === 'object') {
        if (!Object.prototype.hasOwnProperty.call(data, 'tier')) {
            (data as Component).tier = 0;
        }

        componentsActive.push((data as Component));
    }

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] === 'number' || typeof data[i] === 'string') {
                componentsActive.push({
                    tier: i,
                    id: data[i],
                });
            } else if (typeof data[i] === 'object') {
                if (!Object.prototype.hasOwnProperty.call(data[i], 'tier')) {
                    data[i].tier = i;
                }

                componentsActive.push(data[i]);
            }
        }
    }

    await build({
        url: route.fullPath,
        componentsActive,
    });
}
