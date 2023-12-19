import type { RouteLocationNormalized } from 'vue-router';
import type { NavigationItem } from '../type';

export type NavigationProvider = {
    getItems: (
        tier: number,
        itemsActive: NavigationItem[]
    ) => Promise<NavigationItem[] | undefined> | NavigationItem[] | undefined,
    getItemsActiveByURL?: (
        url: string
    ) => Promise<NavigationItem[]> | NavigationItem[],
    getItemsActiveByRoute?: (
        route: RouteLocationNormalized
    ) => Promise<NavigationItem[]> | NavigationItem[]
};
