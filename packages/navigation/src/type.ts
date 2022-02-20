/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type NavigationComponentConfig = {
    id?: string,
    name?: string,
    url?: string,

    default?: boolean,
    type?: 'separator' | 'link',

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
    getComponents(
        tier: number,
        context: TierComponentsActive
    ) : Promise<NavigationComponentConfig[]>;

    hasTier(
        tier: number
    ) : Promise<boolean>;

    getComponentsActive(url: string): Promise<TierComponentsActive>;
}

export type TierComponentsActive = Record<string, NavigationComponentConfig>;
export type TierComponents = Record<string, NavigationComponentConfig[]>;
