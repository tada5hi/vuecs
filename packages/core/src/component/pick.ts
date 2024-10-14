/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    expandPath, getPathInfo, removePath, setPathValue,
} from 'pathtrace';
import type { ComponentsOptions } from './type';

type ComponentsOptionsPickOptions<T extends ComponentsOptions> = {
    include?: (keyof T)[],
    exclude?: (keyof T)[],
};

export function pickComponentsOptions<T extends ComponentsOptions>(
    input: T,
    options: ComponentsOptionsPickOptions<T> = {},
) {
    const output = {} as T;

    if (options.include) {
        for (let i = 0; i < options.include.length; i++) {
            const pathsExpanded = expandPath(input, options.include[i] as string);
            for (let j = 0; j < pathsExpanded.length; j++) {
                const pathInfo = getPathInfo(input, pathsExpanded[j]);
                if (pathInfo.exists) {
                    setPathValue(output, options.include[i] as string, pathInfo.value);
                }
            }
        }
    }

    if (options.exclude) {
        if (!options.include) {
            Object.assign(output, input);
        }

        for (let i = 0; i < options.exclude.length; i++) {
            const pathsExpanded = expandPath(output, options.exclude[i] as string);
            for (let j = 0; j < pathsExpanded.length; j++) {
                removePath(output, pathsExpanded[j]);
            }
        }
    }

    return output;
}
