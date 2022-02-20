/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue from 'vue';
import { useProvider } from '../provider';
import {
    buildTierIndex,
    isComponentMatch,
    parseTier,
    resetNavigationExpansion,
    setNavigationExpansion,
} from '../utils';
import { Component, ComponentsActive } from '../type';
import { NavigationStateKey } from './constants';
import { BuildContext, StateType } from './type';

let NavigationState : StateType = Vue.observable({
    [NavigationStateKey.TIER_COMPONENTS]: {},
    [NavigationStateKey.TIER_ACTIVE_COMPONENT]: {},
});

export function getState() : StateType {
    return NavigationState;
}

export function setState(state: StateType) {
    NavigationState = state;
}

// --------------------------------------------------------

function setActiveComponent(tier: string | number, component: Component | undefined) {
    tier = parseTier(tier);

    Vue.set(NavigationState[NavigationStateKey.TIER_ACTIVE_COMPONENT], tier, component);
}

function setComponents(tier: string | number, components: Component[]) {
    tier = parseTier(tier);

    Vue.set(NavigationState[NavigationStateKey.TIER_COMPONENTS], tier, components);
}

function refreshComponents(tier: string | number) {
    let components = getComponents(tier);
    components = resetNavigationExpansion(components);

    const component = getActiveComponent(tier);
    if (component) {
        const { items } = setNavigationExpansion(components, component);
        components = items;
    }

    setComponents(tier, components);
}

// --------------------------------------------------------

export async function select(
    tier: string | number,
    component: Component,
) {
    const tierIndex = buildTierIndex(tier);

    const isMatch = isComponentMatch(getActiveComponent(tier), component);

    if (isMatch) {
        return;
    }

    setActiveComponent(tier, component);
    refreshComponents(tier);

    const tierMaxIndex = Object.keys(NavigationState.tierComponents).length - 1;
    let tierStartIndex = tierIndex + 1;

    while (tierStartIndex <= tierMaxIndex) {
        await buildForTier(tierStartIndex);

        tierStartIndex++;
    }
}

export function toggle(tier: string | number, component: Component) {
    const isMatch = isComponentMatch(getActiveComponent(tier), component) ||
        component.displayChildren;

    if (isMatch) {
        setActiveComponent(tier, undefined);
    } else {
        setActiveComponent(tier, component);
    }

    refreshComponents(tier);
}

export async function build(
    context?: BuildContext,
) {
    const navigationProvider = useProvider();

    context = context || {};

    let componentsActive : Record<string, Component> = context.activeComponents ?? {};
    const componentsActiveSize = Object.keys(componentsActive).length;

    if (
        componentsActiveSize === 0 &&
        context.url
    ) {
        const urlComponentsActive = await navigationProvider.getComponentsActive(context.url);
        if (urlComponentsActive) {
            componentsActive = urlComponentsActive;
        }
    }

    let tierIndex = 0;
    let tierHasComponents = true;
    while (await navigationProvider.hasTier(tierIndex) && tierHasComponents) {
        const items = await navigationProvider.getComponents(tierIndex, componentsActive);
        if (items.length === 0) {
            tierHasComponents = false;
            continue;
        }

        let currentItem = Object.prototype.hasOwnProperty.call(componentsActive, tierIndex) ?
            componentsActive[tierIndex] :
            undefined;

        if (!currentItem) {
            if (context.url) {
                const urlMatches = items.filter((item) => isComponentMatch(item, { url: context?.url }));
                if (urlMatches) {
                    // eslint-disable-next-line prefer-destructuring
                    currentItem = urlMatches[0];
                }
            }

            if (!currentItem) {
                // eslint-disable-next-line prefer-destructuring
                currentItem = items[0];
            }

            componentsActive[`${tierIndex}`] = currentItem;
        }

        if (!currentItem) {
            continue;
        }

        setActiveComponent(tierIndex, currentItem);

        await buildForTier(tierIndex, componentsActive);

        tierIndex++;
    }
}

export async function buildForTier(
    tier: string | number,
    componentsActive?: ComponentsActive,
) : Promise<void> {
    if (typeof componentsActive === 'undefined') {
        let tierStartIndex = 0;
        const tierEndIndex = buildTierIndex(tier);

        componentsActive = {};

        let componentFound = true;

        while (tierStartIndex <= tierEndIndex && componentFound) {
            const component = getActiveComponent(tierStartIndex);
            if (!component) {
                componentFound = false;
                continue;
            }

            componentsActive[tierStartIndex] = component;

            tierStartIndex++;
        }
    }

    const components : Component[] = await useProvider().getComponents(
        buildTierIndex(tier),
        componentsActive,
    );

    setComponents(tier, components);
    refreshComponents(tier);
}

// --------------------------------------------------------

export function getComponents(tier: number | string) : Component[] {
    tier = parseTier(tier);

    if (Object.prototype.hasOwnProperty.call(NavigationState.tierComponents, tier)) {
        return NavigationState.tierComponents[tier];
    }

    return [];
}

export function getActiveComponent(tier: number | string) : Component | undefined {
    tier = parseTier(tier);

    if (Object.prototype.hasOwnProperty.call(NavigationState.tierComponent, tier)) {
        return NavigationState.tierComponent[tier];
    }

    return undefined;
}

// --------------------------------------------------------
