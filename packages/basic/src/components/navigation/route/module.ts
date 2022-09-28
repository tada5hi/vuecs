/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useRoute } from 'vue-router';
import { hasOwnProperty } from '@vue-layout/core';
import { build } from '../store';
import { NavigationElement } from '../type';
import { isComponent } from '../utils/check';
import { RouteBuildContext } from './type';

function transformToComponents(input: unknown) : NavigationElement[] {
    if (isComponent(input)) {
        return [input];
    }

    if (typeof input === 'string' || typeof input === 'number') {
        return [
            {
                id: input,
            },
        ];
    }

    if (Array.isArray(input)) {
        const items = [];

        for (let i = 0; i < input.length; i++) {
            items.push(...transformToComponents(input[i]));
        }

        return items;
    }

    return [];
}

export async function buildWithRoute(context?: Partial<RouteBuildContext>) {
    context ??= {};
    context.route = context.route || useRoute();
    context.metaKey = context.metaKey || 'navigation';

    const { route, metaKey } = context as RouteBuildContext;

    const components : NavigationElement[] = [];

    const tiers : number[] = [];
    let currentTier = 0;

    const nextTier = () : number => {
        if (tiers.indexOf(currentTier) === -1) {
            tiers.push(currentTier);
            return currentTier;
        }

        currentTier++;

        return nextTier();
    };

    const handleComponents = (items: NavigationElement[]) => {
        for (let j = 0; j < items.length; j++) {
            const itemTier = items[j].tier;
            if (typeof itemTier !== 'undefined') {
                if (tiers.indexOf(itemTier) === -1) {
                    components.push(items[j]);
                    tiers.push(itemTier);
                }
            } else {
                items[j].tier = nextTier();
                components.push(items[j]);
            }
        }
    };

    for (let i = 0; i < route.matched.length; i++) {
        const chainRoute = route.matched[i];

        if (
            chainRoute.meta &&
            hasOwnProperty(chainRoute.meta, metaKey)
        ) {
            const items = transformToComponents(chainRoute.meta[metaKey]);
            handleComponents(items);
        }
    }

    if (
        components.length === 0 &&
        route.meta &&
        hasOwnProperty(route.meta, metaKey)
    ) {
        const items = transformToComponents(route.meta[metaKey]);
        handleComponents(items);
    }

    await build({
        url: route.fullPath,
        components,
    });
}
