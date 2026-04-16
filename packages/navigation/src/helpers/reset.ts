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
