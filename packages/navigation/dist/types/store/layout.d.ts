import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState } from './index';
import { NavigationComponentConfig } from '../type';
export interface LayoutState {
    initialized: boolean;
    navigationComponents: Record<string, NavigationComponentConfig[]>;
    navigationComponent: Record<string, NavigationComponentConfig | undefined>;
}
export declare const state: () => LayoutState;
export declare const getters: GetterTree<LayoutState, RootState>;
export declare const actions: ActionTree<LayoutState, RootState>;
export declare const mutations: MutationTree<LayoutState>;
declare const storePlugin: {
    namespaced: boolean;
    state: () => LayoutState;
    getters: GetterTree<LayoutState, {}>;
    actions: ActionTree<LayoutState, {}>;
    mutations: MutationTree<LayoutState>;
};
export { storePlugin, };
//# sourceMappingURL=layout.d.ts.map