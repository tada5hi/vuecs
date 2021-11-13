/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ActionTree, GetterTree, MutationTree} from "vuex";
import {buildComponents, isComponentMatch, reduceComponents} from "../components";
import {RootState} from "./index";
import {
    getMainNavComponentById,
    getMainNavComponents,
    MainNavComponent
} from "../main-nav";
import {getSideNavComponents, SideNavComponent} from "../side-nav";
import {Component, ComponentType} from "../type";

// --------------------------------------------------------------------

export interface LayoutState {
    initialized: boolean,

    mainComponents: MainNavComponent[],
    mainComponent: MainNavComponent | undefined,

    sideComponents: SideNavComponent[],
    sideComponent: SideNavComponent | undefined
}

export const state = () : LayoutState => ({
    initialized: false,

    mainComponents: [],
    mainComponent: undefined,

    sideComponents: [],
    sideComponent: undefined
});

export const getters : GetterTree<LayoutState, RootState> = {
    mainComponents: (state) : MainNavComponent[] => {
        return state.mainComponents;
    },
    mainComponent: (state) : MainNavComponent | undefined => {
        return state.mainComponent;
    },
    mainComponentId: (state) : string | undefined => {
        return state.mainComponent ?
            state.mainComponent.id :
            undefined;
    },

    sideComponent: (state) : SideNavComponent | undefined => {
        return state.sideComponent;
    },
    sideComponents: (state) : SideNavComponent[] => {
        return state.sideComponents;
    }
};

export const actions : ActionTree<LayoutState, RootState> = {
    async selectComponent({dispatch, commit, getters}, context : {
        type: ComponentType,
        component: Component
    }) {
        if(
            context.type === 'main' &&
            context.component.hasOwnProperty('id')
        ) {
           const component = getMainNavComponentById((context.component as any).id);
           if(typeof component !== 'undefined') {
               context.component = component;
           } else {
               return;
           }
        }

        const isMatch = context.type === 'side' ?
            isComponentMatch(getters.sideComponent, context.component) :
            isComponentMatch(getters.mainComponent, context.component);

        switch (context.type) {
            case 'side':
                commit('setSideComponent', context.component);

                await dispatch('update', {type: 'side', component: context.component});

                break;
            case 'main':
                commit('setMainComponent', context.component);

                await dispatch('update', {type: 'main'});

                if(!isMatch) {
                    await dispatch('update', {type: 'side'});
                }
                break;
        }
    },
    async update(
        {commit, rootGetters},
        context: {
            type: ComponentType,
            component?: Component
        }
    ) {
        switch (context.type) {
            case "main":
                commit('setMainComponents', {
                    auth: this.$auth,
                    loggedIn: rootGetters["auth/loggedIn"]
                });
                break;
            case "side":
                const component : Component = !!context.component ?
                    context.component :
                    {
                        url: (this.$router as any)?.history?.current?.fullPath
                    } as Component;

                commit('setSideComponents', {
                    component,
                    auth: this.$auth,
                    loggedIn: rootGetters["auth/loggedIn"]
                });
                break;
        }
    }
};

export const mutations : MutationTree<LayoutState> = {
    setInitialized(state, value) {
        state.initialized = value;
    },

    setMainComponent (state, component) {
        state.mainComponent = component;
    },
    setMainComponents(state, context) {
        let components = getMainNavComponents();

        components = reduceComponents(components, {
            loggedIn: context.loggedIn,
            auth: context.auth
        })
            .map(component => {
                component.show = true;
                return component;
            });

        state.mainComponents = components;
    },

    setSideComponent(state, component) {
        state.sideComponents = isComponentMatch(state.sideComponent, component) ?
            undefined :
            component;
    },
    setSideComponents (state, context) {
        let components = getSideNavComponents(state.mainComponent?.id);

        const isMatch = context.component && isComponentMatch(state.mainComponent, context.component);

        const build = buildComponents(components, {
            component: context.component ?? undefined,
            type: 'side',
            navigationId: state.mainComponent?.id,
            matchShow: isMatch
        });

        components = build.components;

        components = reduceComponents(components, {
            loggedIn: context.loggedIn,
            auth: context.auth
        });

        state.sideComponents = components;
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
