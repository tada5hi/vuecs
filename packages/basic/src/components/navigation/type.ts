/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type NavigationElement = {
    id?: string | number,
    tier?: number,
    name?: string,

    url?: string,
    urlTarget?: '_self' | '_blank' | '_parent' | '_top' | string,

    default?: boolean,
    type?: 'separator' | 'link',

    icon?: string,

    display?: boolean,
    displayChildren?: boolean,

    rootLink?: boolean,
    children?: NavigationElement[],

    requireLoggedIn?: boolean,
    requireLoggedOut?: boolean,
    requirePermissions?: string | string[] | ((checker: (name: string) => boolean) => boolean)

    [key: string]: any
};
