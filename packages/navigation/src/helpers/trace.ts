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

    for (const [i, element] of a.entries()) {
        if (element !== b[i]) {
            return false;
        }
    }

    return true;
}

export function isTracePartOf(item: string[], parent: string[]) {
    for (const [i, element] of item.entries()) {
        if (parent[i] !== element) {
            return false;
        }
    }

    return true;
}
