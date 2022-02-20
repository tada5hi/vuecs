/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationComponentConfig } from '../type';

export function isComponentMatch(
    one?: NavigationComponentConfig,
    two?: NavigationComponentConfig,
    strict = false,
): boolean {
    if (!(one && two) || (!one || !two)) {
        return false;
    }

    // check when true

    if (
        one.id &&
        two.id &&
        one.id === two.id
    ) {
        return true;
    }

    if (
        !strict &&
        one.name &&
        two.name &&
        one.name === two.name
    ) {
        return true;
    }

    if (
        one.url &&
        two.url
    ) {
        if (one.url === two.url) {
            return true;
        }

        if (
            !strict &&
            !one.rootLink &&
            !two.rootLink
        ) {
            if (
                one.url.startsWith(two.url) ||
                two.url.startsWith(one.url)
            ) {
                return true;
            }
        }
    }

    if (
        one.components &&
        two.components
    ) {
        let allMatched = true;
        for (let i = 0; i < one.components.length; i++) {
            if (!isComponentMatch(one.components[i], two.components[i])) {
                allMatched = false;
                break;
            }
        }

        for (let i = 0; i < two.components.length; i++) {
            if (!isComponentMatch(one.components[i], two.components[i])) {
                allMatched = false;
                break;
            }
        }

        if (allMatched) {
            return true;
        }
    }

    return false;
}
