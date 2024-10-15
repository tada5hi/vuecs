import type { NavigationItem } from '../type';

type TierRecord = {
    tier: number,
    [key: string]: any
};

export function findTierItems<T extends TierRecord>(
    items: T[],
    tier: number,
) : T[] {
    return items.filter((item) => item.tier === tier);
}

export function findTierItem<T extends TierRecord>(
    tier: number,
    items: T[],
) : T | undefined {
    const data = findTierItems(items, tier);
    if (data.length >= 1) {
        return data[0];
    }

    return undefined;
}

export function removeTierItems<T extends TierRecord>(
    tier: number,
    items: T[],
) : T[] {
    return items.filter((item: NavigationItem) => item.tier !== tier);
}

export function replaceTierItem<T extends TierRecord>(
    tier: number,
    input: T[],
    next: T | undefined,
): T[] {
    const output = removeTierItems(tier, input);

    if (next) {
        next.tier = tier;

        return [
            ...output,
            next,
        ];
    }

    return output;
}

export function replaceTierItems<T extends TierRecord>(
    tier: number,
    input: T[],
    next: T[],
) : T[] {
    const componentsExisting = removeTierItems(tier, input);

    return [
        ...componentsExisting,
        ...next,
    ];
}
