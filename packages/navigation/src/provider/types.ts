import type { NavigationItem, NavigationItemNormalized } from '../types';

export interface NavigationProvider {
    find: (
        tier: number,
        parent?: NavigationItemNormalized
    ) => Promise<NavigationItem[] | undefined>
}
