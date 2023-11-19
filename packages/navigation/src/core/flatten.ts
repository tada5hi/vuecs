/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
