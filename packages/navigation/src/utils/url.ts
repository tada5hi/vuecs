/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function isAbsoluteURL(str: string) : boolean {
    return str.substring(0, 7) === 'http://' ||
        str.substring(0, 8) === 'https://';
}
