/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationElement } from '../type';

type ComponentRestrictionContext = {
    hasPermission: (name: string) => boolean;
    isLoggedIn: () => boolean
};

export function reduceNavigationElementsByRestriction<T extends NavigationElement>(
    items: T[],
    context: ComponentRestrictionContext,
) : T[] {
    const result : T[] = [];

    for (let i = 0; i < items.length; i++) {
        if (
            typeof items[i].requireLoggedIn !== 'undefined' &&
            items[i].requireLoggedIn &&
            !context.isLoggedIn()
        ) {
            continue;
        }

        if (
            typeof items[i].requireLoggedOut !== 'undefined' &&
            items[i].requireLoggedOut &&
            context.isLoggedIn()
        ) {
            continue;
        }

        let canPass = true;

        if (
            typeof items[i].requirePermissions !== 'undefined' &&
            canPass
        ) {
            let checks = items[i].requirePermissions;
            if (typeof checks === 'function') {
                if (!checks(context.hasPermission)) {
                    canPass = false;
                }
            } else if (Array.isArray(checks)) {
                checks = checks.filter((item) => item);

                if (
                    checks.length > 0 &&
                    !checks.some((item: any) => context.hasPermission(item))
                ) {
                    canPass = false;
                }
            }
        }

        if (canPass) {
            if (typeof items[i].children !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                items[i].children = reduceComponentsByRestriction(items[i].children, context);
            }

            result.push(items[i]);
        }
    }

    return result;
}
