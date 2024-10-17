/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeClass } from '@vuecs/core';

export type ComponentOptions = {
    groupClass: VNodeClass,
    groupTag: VNodeClass,

    itemClass: VNodeClass,
    itemNestedClass: VNodeClass,
    itemTag: string,

    separatorTag: string,
    separatorClass: VNodeClass,

    linkIconTag: string,
    linkIconClass: VNodeClass

    linkClass: VNodeClass,
    linkRootClass?: VNodeClass,

    linkTextTag: string,
    linkTextClass: VNodeClass,
};
