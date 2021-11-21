/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ActionTree, GetterTree, MutationTree} from "vuex";
import {toggleNavigationComponentTree} from "../toggle";
import {initComponents, isNavigationComponentMatch} from "../utils";
import {RootState} from "./index";

import {
    NavigationComponentConfig,
    NavigationComponentTier,
    NavigationProviderContext
} from "../type";

// --------------------------------------------------------------------

type CommitSetComponentsContextType = {
    tier: NavigationComponentTier,
    loggedIn: boolean,
    components: NavigationComponentConfig[]
}

// --------------------------------------------------------------------

export interface LayoutState {
    initialized: boolean,

    navigationComponents: Record<string, NavigationComponentConfig[]>,
    navigationComponent: Record<string, NavigationComponentConfig | undefined>
}

export const state = () : LayoutState => ({
    initialized: false,

    navigationComponents: {},
    navigationComponent: {}
});

export const getters : GetterTree<LayoutState, RootState> = {
    navigationComponents: (state) => (tier: NavigationComponentTier) : NavigationComponentConfig[] =>  {
        return state.navigationComponents.hasOwnProperty(tier.toString()) ?
            state.navigationComponents[tier.toString()] :
            [];
    },
    navigationComponent: (state) => (tier: NavigationComponentTier) : NavigationComponentConfig | undefined => {
        return state.navigationComponent.hasOwnProperty(tier.toString()) ?
            state.navigationComponent[tier.toString()] :
            undefined;
    },
    navigationComponentId: (state) => (tier: NavigationComponentTier) : string | undefined => {
        return state.navigationComponent.hasOwnProperty(tier.toString()) ?
            state.navigationComponent[tier.toString()]?.id :
            undefined;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectNavigation({dispatch, commit, getters}, context : {
        tier: NavigationComponentTier,
        component?: NavigationComponentConfig
    }) {
        if(typeof context.component === 'undefined') {
            return;
        }

        const isMatch = isNavigationComponentMatch(getters.navigationComponent(context.tier), context.component as NavigationComponentConfig);

        console.log(context);

        commit('setNavigationComponent', {tier: context.tier, component: context.component});

        let tier = context.tier;
        while (getters.navigationComponents(tier).length > 0) {
            if(tier !== context.tier || !isMatch) {
                await dispatch('updateNavigation', {tier});
            }

            tier++;
        }
    },
    toggleNavigationExpansion(
        {commit, getters},
        context: {tier: NavigationComponentTier, component: NavigationComponentConfig}
    ) {
        commit('setNavigationComponent', {
            tier: context.tier,
            component: context.component
        });

        const isMatch = isNavigationComponentMatch(getters.navigationComponent(context.tier), context.component, true);

        commit('setNavigationExpansion', {
            ...context,
            enable: !context.component.displayChildren || !isMatch
        });
    },
    async initNavigation(
        { dispatch, commit },
        context?: NavigationProviderContext
    ) {
        let buildContext : boolean = typeof context === 'undefined';

        context = {
            components: [],
            ...(context ? context : {})
        };

        const currentHistory = (this.$router as any)?.history?.current;
        if(
            typeof currentHistory !== 'undefined' &&
            (
                !context.components ||
                (Array.isArray(context.components) && context.components.length === 0)
            )
        ) {
            const url: string | undefined = currentHistory.fullPath;
            if (
                typeof url !== 'undefined' &&
                this.$layoutNavigationProvider.getContextForUrl
            ) {
                const urlContext = await this.$layoutNavigationProvider.getContextForUrl(url);
                if (typeof urlContext !== 'undefined') {
                    context.components = urlContext.components;

                    buildContext = false;
                }
            }
        }

        const matches = [...context.components];

        let tier = 0;
        while (await this.$layoutNavigationProvider.hasTier(tier)) {
            let items = [...await this.$layoutNavigationProvider.getComponents(tier, context)];
            if(items.length === 0) {
                tier++;
                continue;
            }

            let item : NavigationComponentConfig | undefined = undefined;

            if(matches.length > 0) {
                const poppedItem = matches.shift();
                if(poppedItem) item = poppedItem;
            }

            if(typeof item === 'undefined') {
                item = items.filter(item => item.default || !item.components).shift();
            }

            if(typeof item === 'undefined') {
                tier++;
                continue;
            }

            commit('setNavigationComponent', {
                component: item,
                tier
            });

            await dispatch('updateNavigation', {
                tier: tier,
                components: context.components
            });

            tier++;

            if(buildContext) {
                context.components.push(item);
            }
        }
    },
    async updateNavigation(
        {getters, commit, rootGetters},
        context: {
            tier: NavigationComponentTier,
            components?: NavigationComponentConfig[]
        }
    ) {
        let data : CommitSetComponentsContextType = {
            tier: context.tier,
            loggedIn: rootGetters["auth/loggedIn"],
            components: []
        };

        const providerContext : NavigationProviderContext = {
            ...(context.components ? {components: context.components} : {components: []})
        }

        if(typeof context.components === 'undefined') {
            let tier = 0;
            while (
                tier < context.tier &&
                await this.$layoutNavigationProvider.hasTier(tier)
                ) {
                providerContext.components.push(getters.navigationComponent(tier));
                tier++;
            }
        }

        data.components = [...await this.$layoutNavigationProvider.getComponents(context.tier, providerContext)];

        commit('setNavigationComponents', data);
        commit('setNavigationExpansion', {
            enable: true,
            tier: context.tier,
            component: getters.navigationComponent(context.tier)
        })
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    setNavigationExpansion(state, context: {
        tier: NavigationComponentTier,
        component: NavigationComponentConfig,
        enable: boolean
    }) {
        const tierStr : string = context.tier.toString();

        const {components} = toggleNavigationComponentTree(
            state.navigationComponents[tierStr],
            {
                enable: context.enable,
                component: context.component
            }
        );

        state.navigationComponents = {
            ...state.navigationComponents,
            [tierStr]: components
        }
    },
    setNavigationComponent(state, context: {tier: NavigationComponentTier, component?: NavigationComponentConfig}) {
        const tierStr : string = context.tier.toString();

        state.navigationComponent = {
            ...state.navigationComponent,
            [tierStr]: context.component
        }
    },
    setNavigationComponents(state, context: CommitSetComponentsContextType) {
        let components = [...context.components];
        components = initComponents(components);

        const tierStr : string = context.tier.toString();

        state.navigationComponents = {
            ...state.navigationComponents,
            [tierStr]: components
        };
    }
};

// --------------------------------------------------------------------

const storePlugin = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

export {
    storePlugin
};
