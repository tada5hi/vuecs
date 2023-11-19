/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useRoute } from 'vue-router';
import { hasOwnProperty } from '@vue-layout/core';
import { buildNavigation } from '../module';
import type { NavigationElement } from '../type';
import { isNavigationElement } from '../core/check';
import type { NavigationBuildRouteContext } from './type';

function transformToElements(input: unknown) : NavigationElement[] {
    if (isNavigationElement(input)) {
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
            items.push(...transformToElements(input[i]));
        }

        return items;
    }

    return [];
}

export async function buildNavigationWithRoute(
    context?: Partial<NavigationBuildRouteContext>,
) {
    context ??= {};
    context.route = context.route || useRoute();
    context.metaKey = context.metaKey || 'navigation';

    const { route, metaKey } = context as NavigationBuildRouteContext;

    const elements : NavigationElement[] = [];

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
                    elements.push(items[j]);
                    tiers.push(itemTier);
                }
            } else {
                items[j].tier = nextTier();
                elements.push(items[j]);
            }
        }
    };

    for (let i = 0; i < route.matched.length; i++) {
        const chainRoute = route.matched[i];

        if (
            chainRoute.meta &&
            hasOwnProperty(chainRoute.meta, metaKey)
        ) {
            const items = transformToElements(chainRoute.meta[metaKey]);
            handleComponents(items);
        }
    }

    if (
        elements.length === 0 &&
        route.meta &&
        hasOwnProperty(route.meta, metaKey)
    ) {
        const items = transformToElements(route.meta[metaKey]);
        handleComponents(items);
    }

    await buildNavigation({
        url: route.fullPath,
        itemsActive: elements,
    });
}
