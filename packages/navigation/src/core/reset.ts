/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { NavigationElement } from '../type';

export function resetNavigationElements(
    items: NavigationElement[],
    root = true,
) {
    for (let i = 0; i < items.length; i++) {
        items[i].display = root;
        items[i].displayChildren = false;
        items[i].active = false;

        const { children } = items[i];

        if (typeof children !== 'undefined') {
            items[i].children = resetNavigationElements(children, false);
        }
    }

    return items;
}
