/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function failOnUndefined<T = any>(input: T) : NonNullable<T> {
    if (input === null || typeof input === 'undefined') {
        throw new Error('The input can not be null or undefined.');
    }

    return input;
}
