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

    name: string,
    url?: string,

    icon?: string,
    environment?: 'development' | 'production' | 'testing',

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    components?: NavigationComponentConfig[],

    [key: string]: any
};

export type NavigationComponentConfigSlim = Omit<NavigationComponentConfig, 'name'> &
Partial<Pick<NavigationComponentConfig, 'name'>>;

// --------------------------------------------------------

export interface NavigationProviderInterface {
    getComponent(
        tier: NavigationComponentTier,
        id: string,
        context: NavigationProviderContext
    ) : Promise<NavigationComponentConfig | undefined>;

    getComponents(
        tier: NavigationComponentTier,
        context: NavigationProviderContext
    ) : Promise<NavigationComponentConfig[]>;

    hasTier(
        tier: NavigationComponentTier
    ) : Promise<boolean>;

    getContextForUrl?(url: string): Promise<NavigationProviderContext | undefined>;
}

export type NavigationProviderContext = {
    components: NavigationComponentConfig[]
};

// --------------------------------------------------------

export type NavigationComponentToggleContext = {
    component: NavigationComponentConfigSlim,
    enable: boolean,
    display?: boolean,
    rootLevel?: boolean
};
