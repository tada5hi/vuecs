/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type NavigationComponentTier = number;

export type NavigationComponentConfig = {
    id?: string,
    default?: boolean,
    type?: 'separator' | 'link',

    name?: string,
    url?: string,

    icon?: string,
    environment?: 'development' | 'production' | 'testing',

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    components?: NavigationComponentConfig[],

    [key: string]: any
};

// --------------------------------------------------------

export interface NavigationProviderInterface {
    getComponent(
        tier: NavigationComponentTier,
        id: string,
        context: TierComponentsActive
    ) : Promise<NavigationComponentConfig | undefined>;

    getComponents(
        tier: NavigationComponentTier,
        context: TierComponentsActive
    ) : Promise<NavigationComponentConfig[]>;

    hasTier(
        tier: NavigationComponentTier
    ) : Promise<boolean>;

    getActiveComponents(url: string): Promise<TierComponentsActive>;
}

export type TierComponentsActive = Record<string, NavigationComponentConfig>;
export type TierComponents = Record<string, NavigationComponentConfig[]>;
