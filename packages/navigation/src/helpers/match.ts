import type { NavigationItemNormalized } from '../types';

type ParentMatch = {
    score: number
};

type ItemMatchesFindOptions = {
    path?: string
};

function calculateItemScoreForPath(
    item: NavigationItemNormalized,
    currentPath: string,
) {
    if (item.url === '/') {
        return 1;
    }

    if (item.activeMatch) {
        if (item.activeMatch === currentPath) {
            return 6;
        } if (currentPath.startsWith(item.activeMatch)) {
            return 4;
        }
    }

    if (item.url) {
        if (item.url === currentPath) {
            return 3;
        } if (currentPath.startsWith(item.url)) {
            return 2;
        }
    }

    return 0;
}

function findItemMatchesIF(
    items: NavigationItemNormalized[],
    options: ItemMatchesFindOptions,
    parent: ParentMatch,
) {
    const output : {
        data: NavigationItemNormalized,
        score: number
    }[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        let { score } = parent;

        if (options.path) {
            score += calculateItemScoreForPath(item, options.path);
        }

        if (item.default) {
            score += 1;
        }

        if (item.children) {
            const childMatches = findItemMatchesIF(item.children, options, {
                score,
            });

            output.push(...childMatches);
        }

        output.push({ data: item, score });
    }

    return output.sort((a, b) => b.score - a.score);
}

export function findBestItemMatches(
    items: NavigationItemNormalized[],
    options: ItemMatchesFindOptions = {},
) : NavigationItemNormalized[] {
    const result = findItemMatchesIF(items, options, { score: 0 });
    const [first] = result;
    if (!first) {
        return [];
    }

    return result
        .filter((match) => match.score === first.score)
        .map((match) => match.data);
}
