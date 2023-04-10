/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationElement } from '../type';

export function flattenNestedNavigationElements(
    items: NavigationElement[],
) : NavigationElement[] {
    const output : NavigationElement[] = [];

    for (let i = 0; i < items.length; i++) {
        const { children, ...data } = items[i];

        output.push(data);

        if (typeof children !== 'undefined') {
            output.push(...flattenNestedNavigationElements([...children]));
        }
    }

    return output;
}
