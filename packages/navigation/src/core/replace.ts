import type { NavigationItem } from '../type';
import { removeTierItems } from './tier';

export function replaceTierItem(
    tier: number,
    input: NavigationItem[],
    next: NavigationItem | undefined,
) : NavigationItem[] {
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

export function replaceTierItems(
    tier: number,
    input: NavigationItem[],
    next: NavigationItem[],
) {
    const componentsExisting = removeTierItems(tier, input);

    return [
        ...componentsExisting,
        ...next,
    ];
}
