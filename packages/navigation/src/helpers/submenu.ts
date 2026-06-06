/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    NavigationOrientation,
    NavigationSubmenu,
    NavigationSubmenuMode,
} from '../types';

/**
 * Resolve the effective submenu presentation. An explicit `collapse` /
 * `dropdown` wins; `auto` derives from orientation — only an explicit
 * `horizontal` opts into the dropdown (NavigationMenu) path, everything
 * else collapses (Collapsible).
 */
export function resolveSubmenuMode(
    submenu: NavigationSubmenu | undefined,
    orientation: NavigationOrientation | undefined,
): NavigationSubmenuMode {
    if (submenu === 'collapse' || submenu === 'dropdown') {
        return submenu;
    }

    return orientation === 'horizontal' ? 'dropdown' : 'collapse';
}
