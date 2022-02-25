/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Language, LanguageOptions } from 'ilingo';
import path from 'path';

let instance : Language | undefined;
export function useLayoutLanguage(options?: LanguageOptions) {
    options ??= {};
    let directories : string[] = [];
    if (options.directory) {
        directories = Array.isArray(options.directory) ?
            options.directory :
            [options.directory];
    }

    if (typeof instance !== 'undefined') {
        instance.setOptions({
            directory: [
                ...(directories || []),
                path.join(__dirname, '..', '..', 'assets', 'language'),
            ],
        });

        return instance;
    }

    instance = new Language({
        directory: [
            ...(directories || []),
            path.join(__dirname, '..', '..', 'assets', 'language'),
        ],
    });

    return instance;
}
