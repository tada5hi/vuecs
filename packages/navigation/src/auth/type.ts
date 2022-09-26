/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type ComponentRestrictionContext = {
    hasPermission: (name: string) => boolean;
    isLoggedIn: () => boolean,
    layoutKey?: {
        children?: string,
        requiredAbilities?: string,
        requiredPermissions?: string,
        requiredLoggedOut?: string,
        requiredLoggedIn?: string
    }
};
