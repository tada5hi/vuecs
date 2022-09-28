/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef } from '@vue-layout/core';
import { useProvider } from '../provider';
import {
    findTierComponent, findTierComponents,
    isComponentMatch,
    removeTierFromComponents,
    resetNavigationExpansion,
    setNavigationExpansion, setTierForComponents,
} from '../utils';
import { NavigationElement } from '../type';
import { BuildContext } from './type';
import { setStoreItem, useStoreItem } from './singleton';

function setComponentActive(tier: number, component: NavigationElement | undefined) {
    const data = useStoreItem('componentsActive');
    const componentsExisting = removeTierFromComponents(data, tier);

    if (component) {
        component.tier = tier;

        setStoreItem('componentsActive', [
            ...componentsExisting,
            component,
        ]);
    } else {
        setStoreItem('componentsActive', componentsExisting);
    }
}

function setComponents(tier: number, components: MaybeRef<NavigationElement[]>) {
    const data = useStoreItem('components');
    const componentsExisting = removeTierFromComponents(data, tier);

    setStoreItem('components', [
        ...componentsExisting,
        ...setTierForComponents(components, tier),
    ]);
}

function refreshComponents(tier: number) {
    let components = getComponents(tier);
    components = resetNavigationExpansion(components);

    const component = getActiveComponent(tier);
    if (component) {
        const { items } = setNavigationExpansion(components, component);
        components = items;
    }

    setComponents(tier, components);
}

async function calculateTiers() : Promise<number> {
    let tiers = useStoreItem('tiers');

    if (typeof tiers !== 'undefined') {
        return tiers;
    }

    tiers = 0;

    let match = true;
    while (match) {
        const hasTier = await useProvider().hasTier(tiers);
        if (!hasTier) {
            match = false;
        } else {
            tiers++;
        }
    }

    setStoreItem('tiers', tiers);

    return tiers;
}

// --------------------------------------------------------

export async function select(
    tier: number,
    component: NavigationElement,
) {
    const isMatch = isComponentMatch(getActiveComponent(tier), component);

    if (isMatch) {
        return;
    }

    setComponentActive(tier, component);
    refreshComponents(tier);

    const tiers = await calculateTiers();

    let tierStartIndex = tier + 1;

    while (tierStartIndex <= tiers) {
        await buildForTier(tierStartIndex);

        tierStartIndex++;
    }
}

export function toggle(tier: number, component: NavigationElement) {
    const isMatch = isComponentMatch(getActiveComponent(tier), component) ||
        component.displayChildren;

    if (isMatch) {
        setComponentActive(tier, undefined);
    } else {
        setComponentActive(tier, component);
    }

    refreshComponents(tier);
}

export async function build(context?: BuildContext) : Promise<void> {
    const navigationProvider = useProvider();

    context = context || {};

    let componentsActive : NavigationElement[] = context.components ?? [];

    if (
        componentsActive.length === 0 &&
        context.url
    ) {
        componentsActive = await navigationProvider
            .getComponentsActive(context.url);

        for (let i = 0; i < componentsActive.length; i++) {
            componentsActive[i].tier = i;
        }
    }

    const tierLength = await calculateTiers();
    let tierIndex = 0;

    let tierHasComponents = true;

    while (tierIndex < tierLength && tierHasComponents) {
        let items = await navigationProvider
            .getComponents(tierIndex, [...componentsActive]);

        if (items.length === 0) {
            tierHasComponents = false;
            continue;
        }

        // ensure tier property
        items = setTierForComponents(items, tierIndex);

        let currentItem = findTierComponent(componentsActive, tierIndex);

        if (!currentItem) {
            if (context.url) {
                const urlMatches = items.filter((item) => isComponentMatch(item, { url: context?.url }));
                if (urlMatches && urlMatches.length > 0) {
                    // eslint-disable-next-line prefer-destructuring
                    currentItem = urlMatches[0];
                }
            }

            if (!currentItem) {
                const defaultItem = items
                    .filter((item) => item.default);
                if (defaultItem.length > 0) {
                    currentItem = defaultItem;
                } else {
                    // eslint-disable-next-line prefer-destructuring
                    currentItem = items[0];
                }
            }

            currentItem.tier = tierIndex;
            componentsActive.push(currentItem);
        }

        if (!currentItem) {
            continue;
        }

        setComponentActive(tierIndex, currentItem);

        await buildForTier(tierIndex, componentsActive);

        tierIndex++;
    }
}

export async function buildForTier(
    tier: number,
    componentsActive?: NavigationElement[],
) : Promise<void> {
    if (typeof componentsActive === 'undefined') {
        let tierStartIndex = 0;
        const tierEndIndex = tier;

        componentsActive = [];

        let componentFound = true;

        while (tierStartIndex <= tierEndIndex && componentFound) {
            const component = getActiveComponent(tierStartIndex);
            if (!component) {
                componentFound = false;
                continue;
            }

            componentsActive.push(component);

            tierStartIndex++;
        }
    }

    const components : NavigationElement[] = await useProvider().getComponents(
        tier,
        componentsActive,
    );

    setComponents(tier, [...components]);
    refreshComponents(tier);
}

// --------------------------------------------------------

export function getComponents(tier: number) : NavigationElement[] {
    const data = useStoreItem('components');
    return findTierComponents(data, tier);
}

export function getActiveComponent(tier: number) : NavigationElement | undefined {
    const data = useStoreItem('componentsActive');
    return findTierComponent(data, tier);
}

// --------------------------------------------------------
