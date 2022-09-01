/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { build } from '../store';
import { Component } from '../type';
import { isComponent } from '../utils/check';
import { RouteBuildContext } from './type';

export async function buildWithRoute({ route, metaKey }: RouteBuildContext) {
    let data : unknown;

    if (route.meta) {
        if (
            metaKey in route.meta &&
            route.meta[metaKey]
        ) {
            data = route.meta[metaKey];
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

    const components : Component[] = [];

    if (typeof data === 'string' || typeof data === 'number') {
        components.push({
            tier: 0,
            id: data,
        });
    }

    if (isComponent(data)) {
        if (typeof data.tier === 'undefined') {
            data.tier = 0;
        }

        components.push(data);
    }

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] === 'number' || typeof data[i] === 'string') {
                components.push({
                    tier: i,
                    id: data[i],
                });
            } else if (isComponent(data[i])) {
                if (typeof data[i].tier === 'undefined') {
                    data[i].tier = i;
                }

                components.push(data[i]);
            }
        }
    }

    await build({
        url: route.fullPath,
        components,
    });
}
