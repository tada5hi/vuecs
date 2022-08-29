/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ComponentConfig } from '../component/type';

export function getBootstrapComponentConfig<
    T extends keyof ComponentConfig,
>(
    key: T,
) : ComponentConfig[T] {
    let value : unknown | undefined;

    switch (key) {
        case 'paginationClass':
            value = 'justify-content-center';
            break;
        case 'inputGroupClass':
            value = 'input-group';
            break;
        case 'inputGroupAppendClass':
        case 'inputGroupPrependClass':
        case 'inputGroupTextClass':
            break;
    }

    return value as ComponentConfig[T];
}
