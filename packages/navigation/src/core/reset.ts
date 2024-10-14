import type { NavigationItem } from '../type';

function resetItemIF(
    item: NavigationItem,
    root = true,
) {
    item.display = root;
    item.displayChildren = false;
    item.active = false;

    if (item.children && item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
            item.children[i] = resetItemIF(item.children[i], false);
        }
    }

    return item;
}

export function resetItem(
    item: NavigationItem,
) {
    return resetItemIF(item, true);
}
