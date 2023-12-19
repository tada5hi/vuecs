import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationItem } from '../type';

export type NavigationStore = {
    items: Ref<NavigationItem[]>,
    itemsActive: Ref<NavigationItem[]>
};

export type NavigationStoreInitOptions = {
    forceSet?: boolean
};

export type NavigationBuildContext = {
    itemsActive?: NavigationItem[],
    url?: string
    route?: RouteLocationNormalized
};
