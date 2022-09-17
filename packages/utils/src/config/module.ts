/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Config } from './type';

let instance : Config | undefined;

export function setConfig(input: Partial<Config>) : Config {
    instance = extendConfig(input);

    return instance;
}

export function useConfig() : Config {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = extendConfig({});

    return instance;
}

export function extendConfig(input: Partial<Config>) : Config {
    return {
        preset: input.preset || {},
        component: input.component || {},
    };
}
