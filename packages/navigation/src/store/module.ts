/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue from 'vue';
import { useProvider } from '../provider';
import {
    findTierComponent, findTierComponents, hasOwnProperty,
    isComponentMatch,
    removeTierFromComponents,
    resetNavigationExpansion,
    setNavigationExpansion, setTierForComponents,
} from '../utils';
import { Component } from '../type';
import { NavigationStateKey } from './constants';
import { BuildContext, StateType } from './type';

let NavigationState : StateType = Vue.observable({
    [NavigationStateKey.COMPONENTS]: [],
    [NavigationStateKey.COMPONENTS_ACTIVE]: [],
    [NavigationStateKey.TIERS]: undefined,
});

export function getState() : StateType {
    return NavigationState;
}

export function setState(state: StateType) {
    if (
        typeof state === 'object' &&
        hasOwnProperty(state, NavigationStateKey.COMPONENTS) &&
        hasOwnProperty(state, NavigationStateKey.COMPONENTS_ACTIVE) &&
        hasOwnProperty(state, NavigationStateKey.TIERS)
    ) {
        NavigationState = Vue.observable(state);
    }
}

// --------------------------------------------------------

function setComponentActive(tier: number, component: Component | undefined) {
    const componentsExisting = removeTierFromComponents(NavigationState[NavigationStateKey.COMPONENTS_ACTIVE], tier);

    if (component) {
        component.tier = tier;

        NavigationState[NavigationStateKey.COMPONENTS_ACTIVE] = [
            ...componentsExisting,
            component,
        ];
    } else {
        NavigationState[NavigationStateKey.COMPONENTS_ACTIVE] = componentsExisting;
    }
}

function setComponents(tier: number, components: Component[]) {
    const componentsExisting = removeTierFromComponents(NavigationState[NavigationStateKey.COMPONENTS], tier);

    NavigationState[NavigationStateKey.COMPONENTS] = [
        ...componentsExisting,
        ...setTierForComponents(components, tier),
    ];
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

async function getTierLength() : Promise<number> {
    const { [NavigationStateKey.TIERS]: tier } = NavigationState;
    if (typeof tier === 'number') {
        return tier;
    }

    let tiers = 0;
    let match = true;
    while (match) {
        const hasTier = await useProvider().hasTier(tiers);
        if (!hasTier) {
            match = false;
        } else {
            tiers++;
        }
    }

    NavigationState[NavigationStateKey.TIERS] = tiers;

    return tiers;
}

// --------------------------------------------------------

export async function select(
    tier: number,
    component: Component,
) {
    const isMatch = isComponentMatch(getActiveComponent(tier), component);

    if (isMatch) {
        return;
    }

    setComponentActive(tier, component);
    refreshComponents(tier);

    const tierMaxIndex = NavigationState[NavigationStateKey.TIERS];
    if (typeof tierMaxIndex === 'undefined') {
        return;
    }

    let tierStartIndex = tier + 1;

    while (tierStartIndex <= tierMaxIndex) {
        await buildForTier(tierStartIndex);

        tierStartIndex++;
    }
}

export function toggle(tier: number, component: Component) {
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

    let componentsActive : Component[] = context.components ?? [];

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

    const tierLength = await getTierLength();
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
    componentsActive?: Component[],
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

    const components : Component[] = await useProvider().getComponents(
        tier,
        componentsActive,
    );

    setComponents(tier, [...components]);
    refreshComponents(tier);
}

// --------------------------------------------------------

export function getComponents(tier: number) : Component[] {
    return findTierComponents(NavigationState[NavigationStateKey.COMPONENTS], tier);
}

export function getActiveComponent(tier: number) : Component | undefined {
    return findTierComponent(NavigationState[NavigationStateKey.COMPONENTS_ACTIVE], tier);
}

// --------------------------------------------------------
