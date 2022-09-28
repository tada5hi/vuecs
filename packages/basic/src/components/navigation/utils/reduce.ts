/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationElement } from '../type';

type ComponentRestrictionContext = {
    hasPermission: (name: string) => boolean;
    isLoggedIn: () => boolean
};

export function reduceComponentsByRestriction<T extends NavigationElement>(
    components: T[],
    context: ComponentRestrictionContext,
) : T[] {
    const result : T[] = [];

    for (let i = 0; i < components.length; i++) {
        if (
            typeof components[i].requireLoggedIn !== 'undefined' &&
            components[i].requireLoggedIn &&
            !context.isLoggedIn()
        ) {
            continue;
        }

        if (
            typeof components[i].requireLoggedOut !== 'undefined' &&
            components[i].requireLoggedOut &&
            context.isLoggedIn()
        ) {
            continue;
        }

        let canPass = true;

        if (
            typeof components[i].requirePermissions !== 'undefined' &&
            canPass
        ) {
            let checks = components[i].requirePermissions;
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
            if (typeof components[i].components !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                components[i].components = reduceComponentsByRestriction(components[i].components, context);
            }

            result.push(components[i]);
        }
    }

    return result;
}
