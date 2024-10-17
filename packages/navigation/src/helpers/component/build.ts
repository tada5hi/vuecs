/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { VNodeClass } from '@vuecs/core';
import { createComponentOptionsManager, mergeOption } from '@vuecs/core';
import type { ComponentOptions } from './types';

export function buildComponentOptions() : ComponentOptions {
    const manager = createComponentOptionsManager<ComponentOptions>({
        name: 'navigation',
    });

    return {
        groupClass: mergeOption('class', manager.get('groupClass'), 'vc-nav-items') as VNodeClass,
        groupTag: manager.get('groupTag') || 'ul',

        itemClass: mergeOption('class', manager.get('itemClass'), 'vc-nav-item') as VNodeClass,
        itemNestedClass: mergeOption('class', manager.get('itemNestedClass'), 'vc-nav-item-nested') as VNodeClass,
        itemTag: manager.get('itemTag') || 'li',

        separatorTag: manager.get('separatorTag') || 'div',
        separatorClass: mergeOption('class', manager.get('linkIconClass'), 'vc-nav-separator') as VNodeClass,

        linkIconTag: manager.get('linkIconTag') || 'div',
        linkIconClass: mergeOption('class', manager.get('linkIconClass'), 'vc-nav-link-icon') as VNodeClass,

        linkClass: mergeOption('class', manager.get('linkClass'), 'vc-nav-link') as VNodeClass,
        linkRootClass: mergeOption('class', manager.get('linkRootClass'), 'vc-nav-link-root') as VNodeClass,
        linkTextTag: manager.get('linkTextTag') || 'div',
        linkTextClass: mergeOption('class', manager.get('linkTextClass'), 'vc-nav-link-text') as VNodeClass,
    };
}
