import type { NavigationItem } from '../type';

export function flattenNestedNavigationItems(
    items: NavigationItem[],
) : NavigationItem[] {
    const output : NavigationItem[] = [];

    for (let i = 0; i < items.length; i++) {
        const { children, ...data } = items[i];

        output.push(data);

        if (
            children &&
            children.length > 0
        ) {
            output.push(...flattenNestedNavigationItems([...children]));
        }
    }

    return output;
}
