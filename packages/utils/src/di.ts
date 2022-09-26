/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

const instances : Record<string, any> = {};

export function provide(key: string, value: any) {
    instances[key] = value;
}

export function inject(key: string) {
    return instances[key];
}
