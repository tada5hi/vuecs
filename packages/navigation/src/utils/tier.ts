/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function parseTier(value: string | number): string {
    return typeof value === 'string' ?
        value :
        value.toString();
}

export function buildTierIndex(value: string | number): number {
    return parseInt(`${value}`, 10);
}
