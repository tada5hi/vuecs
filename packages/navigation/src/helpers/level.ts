type LevelRecord = {
    level: number,
    [key: string]: any
};

export function findItemsWithLevel<T extends LevelRecord>(
    items: T[],
    tier: number,
) : T[] {
    return items.filter((item) => item.level === tier);
}

export function findItemWithLevel<T extends LevelRecord>(
    tier: number,
    items: T[],
) : T | undefined {
    const data = findItemsWithLevel(items, tier);
    if (data.length >= 1) {
        return data[0];
    }

    return undefined;
}

export function removeItemsWithLevel<T extends LevelRecord>(
    tier: number,
    items: T[],
) : T[] {
    return items.filter((item) => item.level !== tier);
}

export function replaceLevelItem<T extends LevelRecord>(
    tier: number,
    input: T[],
    next: T | undefined,
): T[] {
    const output = removeItemsWithLevel(tier, input);

    if (next) {
        next.level = tier;

        return [
            ...output,
            next,
        ];
    }

    return output;
}

export function replaceLevelItems<T extends LevelRecord>(
    tier: number,
    src: T[],
    next: T[],
) : T[] {
    const componentsExisting = removeItemsWithLevel(tier, src);

    return [
        ...componentsExisting,
        ...next,
    ];
}
