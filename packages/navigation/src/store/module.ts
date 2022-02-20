/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue from 'vue';
import { useNavigationProvider } from '../provider';
import {
    buildTierIndex,
    getActiveComponent,
    parseTier,
    resetNavigationExpansion,
    setNavigationExpansion,
} from '../utils';
import { NavigationComponentConfig, TierComponentsActive } from '../type';
import { isComponentMatch } from '../utils/match';
import { NavigationStateKey } from './constants';
import { NavigationBuildContext, NavigationStateType } from './type';

const NavigationState : NavigationStateType = Vue.observable({
    [NavigationStateKey.TIER_COMPONENTS]: {},
    [NavigationStateKey.TIER_ACTIVE_COMPONENT]: {},
});

// --------------------------------------------------------

function setActiveComponent(tier: string | number, component: NavigationComponentConfig | undefined) {
    tier = parseTier(tier);

    Vue.set(NavigationState[NavigationStateKey.TIER_ACTIVE_COMPONENT], tier, component);
}

function setComponents(tier: string | number, components: NavigationComponentConfig[]) {
    tier = parseTier(tier);

    Vue.set(NavigationState[NavigationStateKey.TIER_COMPONENTS], tier, components);
}

// --------------------------------------------------------

export async function selectNavigation(tier: string | number, component: NavigationComponentConfig) {
    const tierIndex = buildTierIndex(tier);

    const isMatch = isComponentMatch(getNavigationActiveComponent(tier), component, true);

    if (isMatch && tierIndex === 0) {
        return;
    }

    setActiveComponent(tier, component);

    const tierMaxIndex = Object.keys(NavigationState.tierComponents).length - 1;
    let tierStartIndex = tierIndex + 1;

    while (tierStartIndex <= tierMaxIndex) {
        await buildNavigationForTier(tierStartIndex);

        tierStartIndex++;
    }
}

export function toggleNavigation(tier: string | number, component: NavigationComponentConfig) {
    const isMatch = isComponentMatch(getNavigationActiveComponent(tier), component, true);

    let components = getNavigationComponents(tier);
    resetNavigationExpansion(components);

    if (!isMatch) {
        setActiveComponent(tier, component);
        const { items } = setNavigationExpansion(components, component);

        components = items;
    }

    setComponents(tier, components);
}

export async function buildNavigation(
    context?: NavigationBuildContext,
) {
    const navigationProvider = useNavigationProvider();

    context = context || {};

    let componentsActive : Record<string, NavigationComponentConfig> = context.activeComponents ?? {};
    const componentsActiveSize = Object.keys(componentsActive).length;

    if (
        componentsActiveSize === 0 &&
        context.url
    ) {
        componentsActive = await navigationProvider.getActiveComponents(context.url);
    }

    let tierIndex = 0;
    let tierHasComponents = true;
    while (await navigationProvider.hasTier(tierIndex) && tierHasComponents) {
        const items = await navigationProvider.getComponents(tierIndex, componentsActive);
        if (items.length === 0) {
            tierHasComponents = false;
            continue;
        }

        let currentItem = getActiveComponent(componentsActive, tierIndex);
        if (!currentItem) {
            currentItem = items.shift();

            if (!currentItem) {
                continue;
            }

            componentsActive[`${tierIndex}`] = currentItem;
        }

        setActiveComponent(tierIndex, currentItem);

        await buildNavigationForTier(tierIndex);

        tierIndex++;
    }
}

export async function buildNavigationForTier(
    tier: string | number,
    componentsActive?: TierComponentsActive,
) : Promise<void> {
    if (typeof componentsActive === 'undefined') {
        let tierStartIndex = 0;
        const tierEndIndex = buildTierIndex(tier);

        componentsActive = {};

        let componentFound = true;

        while (tierStartIndex <= tierEndIndex && componentFound) {
            const component = getNavigationActiveComponent(tierStartIndex);
            if (!component) {
                componentFound = false;
                continue;
            }

            componentsActive[tierStartIndex] = component;

            tierStartIndex++;
        }
    }

    const components : NavigationComponentConfig[] = await useNavigationProvider().getComponents(
        buildTierIndex(tier),
        componentsActive,
    );

    setComponents(tier, components);
}

// --------------------------------------------------------

export function getNavigationComponents(tier: number | string) : NavigationComponentConfig[] {
    tier = parseTier(tier);

    if (Object.prototype.hasOwnProperty.call(NavigationState.tierComponents, tier)) {
        return NavigationState.tierComponents[tier];
    }

    return [];
}

export function getNavigationActiveComponent(tier: number | string) : NavigationComponentConfig | undefined {
    tier = parseTier(tier);

    if (Object.prototype.hasOwnProperty.call(NavigationState.tierComponent, tier)) {
        return NavigationState.tierComponent[tier];
    }

    return undefined;
}

// --------------------------------------------------------
