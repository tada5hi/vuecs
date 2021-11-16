/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ActionTree, GetterTree, MutationTree} from "vuex";
import {reduceComponents} from "../reduce";
import {toggleComponentTree} from "../toggle";
import {initComponents, isComponentMatch} from "../utils";
import {RootState} from "./index";

import {AuthModuleInterface, Component, ComponentLevel, LayoutProviderContext} from "../type";

// --------------------------------------------------------------------

type CommitSetComponentsContextType = {
    level: ComponentLevel,
    auth: AuthModuleInterface,
    loggedIn: boolean,
    components: Component[]
}

// --------------------------------------------------------------------

export interface LayoutState {
    initialized: boolean,

    levelComponents: Record<string, Component[]>,
    levelComponent: Record<string, Component | undefined>
}

export const state = () : LayoutState => ({
    initialized: false,

    levelComponents: {},
    levelComponent: {}
});

export const getters : GetterTree<LayoutState, RootState> = {
    components: (state) => (level: ComponentLevel) : Component[] =>  {
        return state.levelComponents.hasOwnProperty(level.toString()) ?
            state.levelComponents[level.toString()] :
            [];
    },
    component: (state) => (level: ComponentLevel) : Component | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()] :
            undefined;
    },
    componentId: (state) => (level: ComponentLevel) : string | undefined => {
        return state.levelComponent.hasOwnProperty(level.toString()) ?
            state.levelComponent[level.toString()]?.id :
            undefined;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectComponent({dispatch, commit, getters}, context : {
        level: ComponentLevel,
        component?: Component
    }) {
        if(typeof context.component === 'undefined') {
            return;
        }

        const isMatch = isComponentMatch(getters.component(context.level), context.component as Component);

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
        context: {level: ComponentLevel, component: Component}
    ) {
        const levelStr : string = context.level.toString();
        const isMatch = isComponentMatch(state.levelComponent[levelStr], context.component);

        commit('setComponent', {
            level: context.level,
            component: isMatch ? undefined : context.component
        });

        commit('toggleComponentExpansion', context);
    },
    async init(
        { dispatch, commit },
        context?: LayoutProviderContext
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
                level,
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
            level: ComponentLevel,
            components?: Component[]
        }
    ) {
        let data : CommitSetComponentsContextType = {
            level: context.level,
            auth: this.$auth,
            loggedIn: rootGetters["auth/loggedIn"],
            components: []
        };

        const providerContext : LayoutProviderContext = {
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

        let components = await this.$layoutProvider.getComponents(context.level, providerContext);
        components = initComponents(components);
        data.components = components;

        commit('setComponents', data);
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    toggleComponentExpansion(state, context: {level: ComponentLevel, component: Component}) {
        const levelStr : string = context.level.toString();
        const isMatch = isComponentMatch(state.levelComponent[levelStr], context.component);

        const {components} = toggleComponentTree(
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
    setComponent(state, context: {level: ComponentLevel, component?: Component}) {
        const levelStr : string = context.level.toString();

        state.levelComponent = {
            ...state.levelComponent,
            [levelStr]: context.component
        }
    },
    setComponents(state, context: CommitSetComponentsContextType) {
        const levelStr : string = context.level.toString();

        state.levelComponents = {
            ...state.levelComponents,
            [levelStr]: reduceComponents(context.components, {
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
