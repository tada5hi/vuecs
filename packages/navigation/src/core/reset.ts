import type { NavigationItemNormalized } from '../type';
import { isTraceEqual, isTracePartOf } from '../utils';

function resetItemsByTraceIF(
    items: NavigationItemNormalized[],
    trace: string[],
) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const isEqual = isTraceEqual(items[i].trace, trace);
        item.active = isEqual;
        item.display = true;

        if (isEqual) {
            item.displayChildren = true;
        } else {
            item.displayChildren = isTracePartOf(item.trace, trace);
        }

        item.children = resetItemsByTraceIF(item.children, trace);
    }

    return items;
}

export function resetItemsByTrace(
    items: NavigationItemNormalized[],
    trace: string[],
) {
    return resetItemsByTraceIF(items, trace);
}
