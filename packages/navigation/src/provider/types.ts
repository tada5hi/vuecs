import type { NavigationItem, NavigationItemNormalized } from '../types';

export interface NavigationProvider {
    getItems: (
        tier: number,
        parent?: NavigationItemNormalized
    ) => Promise<NavigationItem[] | undefined> | NavigationItem[] | undefined
}
