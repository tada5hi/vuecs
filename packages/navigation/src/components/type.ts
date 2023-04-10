/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type LinkProperties = {
    active?: boolean,
    disabled?: boolean,
    href?: string,
    prefetch?: boolean,
    target?: string,
    to?: string,
    [key: string]: any
};
