import type { NavigationItemNormalized } from '../types';
import { isTraceEqual, isTracePartOf } from './trace';

function resetItemsByTraceIF(
    items: NavigationItemNormalized[],
    trace: string[],
) {
    for (const item of items) {
        const isEqual = isTraceEqual(item.trace, trace);
        item.active = isEqual;
        item.display = true;

        if (isEqual) {
            item.activeWithin = false;
            item.displayChildren = true;
        } else {
            const isAncestor = isTracePartOf(item.trace, trace);
            item.activeWithin = isAncestor;
            item.displayChildren = isAncestor;
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
