import type { NavigationItem } from '../type';

export function resetNavigationItem(
    items: NavigationItem[],
    root = true,
) {
    for (let i = 0; i < items.length; i++) {
        items[i].display = root;
        items[i].displayChildren = false;
        items[i].active = false;

        const { children } = items[i];

        if (typeof children !== 'undefined') {
            items[i].children = resetNavigationItem(children, false);
        }
    }

    return items;
}
