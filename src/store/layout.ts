/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ActionTree, GetterTree, MutationTree} from "vuex";
import {reduceNavigationComponents} from "../reduce";
import {toggleNavigationComponentTree} from "../toggle";
import {initComponents, isNavigationComponentMatch} from "../utils";
import {RootState} from "./index";

import {AuthModuleInterface, NavigationComponentConfig, NavigationComponentLevel, NavigationProviderContext} from "../type";

// --------------------------------------------------------------------

type CommitSetComponentsContextType = {
    level: NavigationComponentLevel,
    auth: AuthModuleInterface,
    loggedIn: boolean,
    components: NavigationComponentConfig[]
}

// --------------------------------------------------------------------

export interface LayoutState {
    initialized: boolean,

    levelComponents: Record<string, NavigationComponentConfig[]>,
    levelComponent: Record<string, NavigationComponentConfig | undefined>
}

export const state = () : LayoutState => ({
    initialized: false,

    levelComponents: {},
    levelComponent: {}
});

export const getters : GetterTree<LayoutState, RootState> = {
    navigationComponents: (state) => (level: NavigationComponentLevel) : NavigationComponentConfig[] =>  {
        return state.levelComponents.hasOwnProperty(level.toString()) ?
            state.levelComponents[level.toString()] :
            [];
    },
    navigationComponent: (state) => (level: NavigationComponentLevel) : NavigationComponentConfig | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()] :
            undefined;
    },
    navigationComponentId: (state) => (level: NavigationComponentLevel) : string | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()]?.id :
            undefined;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectNavigation({dispatch, commit, getters}, context : {
        level: NavigationComponentLevel,
        component?: NavigationComponentConfig
    }) {
        if(typeof context.component === 'undefined') {
            return;
        }

        const isMatch = isNavigationComponentMatch(getters.navigationComponent(context.level), context.component as NavigationComponentConfig);

        commit('setNavigationComponent', {level: context.level, component: context.component});

        let level = context.level;
        while (getters.navigationComponents(level).length > 0) {
            if(level !== context.level || !isMatch) {
                await dispatch('updateNavigation', {level});
            }

            level++;
        }
    },
    toggleNavigationExpansion(
        {commit, state},
        context: {level: NavigationComponentLevel, component: NavigationComponentConfig}
    ) {
        const levelStr : string = context.level.toString();
        const isMatch = isNavigationComponentMatch(state.levelComponent[levelStr], context.component);

        commit('setNavigationComponent', {
            level: context.level,
            component: isMatch ? undefined : context.component
        });

        commit('toggleNavigationExpansion', context);
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

        const url : string | undefined = (this.$router as any)?.history?.current?.fullPath;
        if(
            typeof url !== 'undefined' &&
            this.$navigationProvider.getContextForUrl
        ) {
            const urlContext = await this.$navigationProvider.getContextForUrl(url);
            if(typeof urlContext !== 'undefined') {
                context.components = urlContext.components;

                buildContext = false;
            }
        }

        let level = 0;
        while (await this.$navigationProvider.hasLevel(level)) {
            let items = await this.$navigationProvider.getComponents(level, context);
            if(items.length === 0) {
                level++;
                continue;
            }

            const defaultItem = items.filter(item => !!item.default).pop();

            const item = defaultItem ?? items[0];

            await dispatch('updateNavigation', {
                level: level,
                components: context.components
            });

            commit('toggleNavigationExpansion', {
                component: item,
                level
            })

            commit('setNavigationComponent', {
                component: item,
                level
            });

            level++;

            if(buildContext) {
                context.components.push(item);
            }
        }
    },
    async updateNavigation(
        {getters, commit, rootGetters},
        context: {
            level: NavigationComponentLevel,
            components?: NavigationComponentConfig[]
        }
    ) {
        let data : CommitSetComponentsContextType = {
            level: context.level,
            auth: this.$auth,
            loggedIn: rootGetters["auth/loggedIn"],
            components: []
        };

        const providerContext : NavigationProviderContext = {
            ...(context.components ? {components: context.components} : {components: []})
        }

        if(typeof context.components === 'undefined') {
            let level = 0;
            while (
                level < context.level &&
                await this.$navigationProvider.hasLevel(level)
                ) {
                providerContext.components.push(getters.navigationComponent(level));
                level++;
            }
        }

        data.components = await this.$navigationProvider.getComponents(context.level, providerContext);

        commit('setNavigationComponents', data);
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    toggleNavigationExpansion(state, context: {level: NavigationComponentLevel, component: NavigationComponentConfig}) {
        const levelStr : string = context.level.toString();
        const isMatch = isNavigationComponentMatch(state.levelComponent[levelStr], context.component);

        const {components} = toggleNavigationComponentTree(
            state.levelComponents[levelStr],
            {
                enable: !isMatch,
                component: context.component
            }
        );

        state.levelComponents = {
            ...state.levelComponents,
            [levelStr]: components
        }
    },
    setNavigationComponent(state, context: {level: NavigationComponentLevel, component?: NavigationComponentConfig}) {
        const levelStr : string = context.level.toString();

        state.levelComponent = {
            ...state.levelComponent,
            [levelStr]: context.component
        }
    },
    setNavigationComponents(state, context: CommitSetComponentsContextType) {
        let components = [...context.components];
        components = initComponents(components);

        const levelStr : string = context.level.toString();

        state.levelComponents = {
            ...state.levelComponents,
            [levelStr]: reduceNavigationComponents(components, {
                loggedIn: context.loggedIn,
                auth: context.auth
            })
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
