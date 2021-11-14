/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ActionTree, GetterTree, MutationTree} from "vuex";
import {isComponentMatch, reduceComponents} from "../components";
import {RootState} from "./index";

import {AuthModule, Component, ComponentLevelName} from "../type";

type CommitSetComponentsContextType = {
    level: ComponentLevelName,
    auth: AuthModule,
    loggedIn: boolean,
    currentURL: string | undefined,
    components: Component[]
}

// --------------------------------------------------------------------

export interface LayoutState {
    initialized: boolean,

    levelComponents: Record<ComponentLevelName, Component[]>,
    levelComponent: Record<ComponentLevelName, Component | undefined>
}

export const state = () : LayoutState => ({
    initialized: false,

    levelComponents: {},
    levelComponent: {}
});

export const getters : GetterTree<LayoutState, RootState> = {
    components: (state) => (level: ComponentLevelName) : Component[] =>  {
        return state.levelComponents.hasOwnProperty(level) ?
            state.levelComponents[level] :
            [];
    },
    component: (state) => (level: ComponentLevelName) : Component | undefined => {
        return state.levelComponent.hasOwnProperty(level) ?
            state.levelComponent[level] :
            undefined;
    },
    componentId: (state) => (level: ComponentLevelName) : string | undefined => {
        return state.levelComponent.hasOwnProperty(level) ?
            state.levelComponent[level]?.id :
            undefined;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectComponent({dispatch, commit, getters}, context : {
        level: ComponentLevelName,
        component: Component | string
    }) {
        if(typeof context.component === 'string') {
            const component = await this.$layoutProvider.getComponent(context.level, context.component);
            if(typeof component !== 'undefined') {
                context.component = component;
            } else {
                return;
            }
        }

        const isMatch = isComponentMatch(getters.component(context.level), context.component as Component);

        commit('setComponent', {level: context.level, component: context.component});

        let level = parseInt(context.level.replace('level-', ''), 10);
        while (getters.components(`level-${level}`).length > 0) {
            if(`level-${level}` !== context.level || !isMatch) {
                await dispatch('update', {level: `level-${level}`});
            }

            level++;
        }
    },
    async update(
        {commit, rootGetters},
        context: {
            level: ComponentLevelName,
            component?: Component
        }
    ) {
        let data : CommitSetComponentsContextType = {
            level: context.level,
            auth: this.$auth,
            loggedIn: rootGetters["auth/loggedIn"],
            currentURL: undefined,
            components: []
        };

        // todo: eq to context.component ? like parent ?
        data.currentURL = (this.$router as any)?.history?.current?.fullPath;

        data.components = await this.$layoutProvider.getComponents(context.level);
        commit('setComponents', data);
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    setComponent(state, context: {level: ComponentLevelName, component: Component}) {
        state.levelComponent[context.level] = state.levelComponent[context.level] === context.component ?
            undefined : context.component;
    },
    setComponents(state, context: CommitSetComponentsContextType) {
        /*
        const isMatch = context.component && isComponentMatch(state.mainComponent, context.component);

        const build = buildComponents(components, {
            component: context.component ?? undefined,
            type: 'side',
            navigationId: state.mainComponent?.id,
            matchShow: isMatch
        });

        components = build.components;
         */

        state.levelComponents[context.level] = reduceComponents(context.components, {
            loggedIn: context.loggedIn,
            auth: context.auth
        });
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
