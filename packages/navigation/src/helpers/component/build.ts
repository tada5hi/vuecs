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
        itemTag: manager.get('itemTag') || 'li',

        subGroupTitleClass: mergeOption('class', manager.get('subGroupTitleClass'), 'vc-nav-sub-level-title') as VNodeClass,
        subGroupItemsClass: mergeOption('class', manager.get('subGroupTitleClass'), 'vc-nav-sub-level-items') as VNodeClass,

        separatorTag: manager.get('separatorTag') || 'div',
        separatorClass: mergeOption('class', manager.get('iconClass'), 'vc-nav-separator') as VNodeClass,

        iconClass: mergeOption('class', manager.get('iconClass'), 'vc-nav-icon') as VNodeClass,

        linkClass: mergeOption('class', manager.get('linkClass'), 'vc-nav-link') as VNodeClass,
        linkRootClass: mergeOption('class', manager.get('linkRootClass'), 'vc-nav-link-root') as VNodeClass,
        linkTextTag: manager.get('linkTextTag') || 'span',
        linkTextClass: mergeOption('class', manager.get('linkTextClass'), 'vc-nav-link-text') as VNodeClass,
    };
}
