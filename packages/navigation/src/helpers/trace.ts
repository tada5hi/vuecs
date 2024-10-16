/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function isTraceEqual(
    a: string[],
    b: string[],
): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

export function isTracePartOf(item: string[], parent: string[]) {
    for (let i = 0; i < item.length; i++) {
        if (parent[i] !== item[i]) {
            return false;
        }
    }

    return true;
}
