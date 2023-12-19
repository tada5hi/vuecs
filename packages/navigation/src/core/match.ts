import type { NavigationItem } from '../type';

export function isNavigationItemMatch(
    one?: NavigationItem,
    two?: NavigationItem,
): boolean {
    if (!one || !two) {
        return false;
    }

    if (
        one.id &&
        two.id &&
        one.id === two.id
    ) {
        return true;
    }

    if (
        one.name &&
        two.name &&
        one.name === two.name
    ) {
        return true;
    }

    if (
        one.url &&
        two.url &&
        one.url === two.url
    ) {
        return true;
    }

    if (
        one.children &&
        two.children &&
        one.children.length === two.children.length
    ) {
        for (let i = 0; i < one.children.length; i++) {
            if (!isNavigationItemMatch(one.children[i], two.children[i])) {
                return false;
            }
        }

        return true;
    }

    return false;
}
