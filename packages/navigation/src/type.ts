/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type Component = {
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
    components?: Component[],

    [key: string]: any
};

// --------------------------------------------------------

export interface ProviderInterface {
    getComponents(
        tier: number,
        context: ComponentsActive
    ) : Promise<Component[]>;

    getComponentsActive(url: string): Promise<ComponentsActive | undefined>;

    hasTier(
        tier: number
    ) : Promise<boolean>;
}

export type ComponentsActive = Record<string, Component>;
export type Components = Record<string, Component[]>;
