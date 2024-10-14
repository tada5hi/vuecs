import type { NavigationItem } from '../type';

export function findTierItems(
    items: NavigationItem[],
    tier: number,
) : NavigationItem[] {
    const filterFn = (
        component: NavigationItem,
    ) => typeof component.tier !== 'undefined' && component.tier === tier;

    return items.filter(filterFn);
}

export function findTierItem(
    tier: number,
    items: NavigationItem[],
) : NavigationItem | undefined {
    const data = findTierItems(items, tier);
    if (data.length >= 1) {
        return data[0];
    }

    return undefined;
}

export function removeTierItems(
    tier: number,
    items: NavigationItem[],
) {
    return items.filter((item: NavigationItem) => typeof item.tier === 'undefined' || item.tier !== tier);
}
