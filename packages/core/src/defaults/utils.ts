/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { inject, provide } from '../di';

export function setDefaults(
    input: Record<string, Record<string, any>>,
    injectionKey?: string,
) {
    provide(injectionKey || 'defaults', input);
}

export function useDefaults(injectionKey?: string) {
    const defaults = inject(injectionKey || 'defaults');
    if (typeof defaults === 'undefined') {
        return {};
    }

    return defaults;
}
