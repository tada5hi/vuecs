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
    components: (state) => (level: NavigationComponentLevel) : NavigationComponentConfig[] =>  {
        return state.levelComponents.hasOwnProperty(level.toString()) ?
            state.levelComponents[level.toString()] :
            [];
    },
    component: (state) => (level: NavigationComponentLevel) : NavigationComponentConfig | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()] :
            undefined;
    },
    componentId: (state) => (level: NavigationComponentLevel) : string | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()]?.id :
            undefined;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectComponent({dispatch, commit, getters}, context : {
        level: NavigationComponentLevel,
        component?: NavigationComponentConfig
    }) {
        if(typeof context.component === 'undefined') {
            return;
        }

        const isMatch = isNavigationComponentMatch(getters.component(context.level), context.component as NavigationComponentConfig);

        commit('setComponent', {level: context.level, component: context.component});

        let level = context.level;
        while (getters.components(level).length > 0) {
            if(level !== context.level || !isMatch) {
                await dispatch('update', {level});
            }

            level++;
        }
    },
    toggleComponentExpansion(
        {commit, state},
        context: {level: NavigationComponentLevel, component: NavigationComponentConfig}
    ) {
        const levelStr : string = context.level.toString();
        const isMatch = isNavigationComponentMatch(state.levelComponent[levelStr], context.component);

        commit('setComponent', {
            level: context.level,
            component: isMatch ? undefined : context.component
        });

        commit('toggleComponentExpansion', context);
    },
    async init(
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
            this.$layoutProvider.getContextForUrl
        ) {
            const urlContext = await this.$layoutProvider.getContextForUrl(url);
            if(typeof urlContext !== 'undefined') {
                context.components = urlContext.components;

                buildContext = false;
            }
        }

        let level = 0;
        while (await this.$layoutProvider.hasLevel(level)) {
            let items = await this.$layoutProvider.getComponents(level, context);
            if(items.length === 0) {
                level++;
                continue;
            }

            const defaultItem = items.filter(item => !!item.default).pop();

            const item = defaultItem ?? items[0];

            await dispatch('update', {
                level: level,
                components: context.components
            });

            commit('toggleComponentExpansion', {
                component: item,
                level
            })

            commit('setComponent', {
                component: item,
                level
            });

            level++;

            if(buildContext) {
                context.components.push(item);
            }
        }
    },
    async update(
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
                await this.$layoutProvider.hasLevel(level)
                ) {
                providerContext.components.push(getters.component(level));
                level++;
            }
        }

        data.components = await this.$layoutProvider.getComponents(context.level, providerContext);

        commit('setComponents', data);
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    toggleComponentExpansion(state, context: {level: NavigationComponentLevel, component: NavigationComponentConfig}) {
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
    setComponent(state, context: {level: NavigationComponentLevel, component?: NavigationComponentConfig}) {
        const levelStr : string = context.level.toString();

        state.levelComponent = {
            ...state.levelComponent,
            [levelStr]: context.component
        }
    },
    setComponents(state, context: CommitSetComponentsContextType) {
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
