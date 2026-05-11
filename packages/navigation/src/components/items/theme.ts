import type { ComponentThemeDefinition } from '@vuecs/core';
import type { NavigationThemeClasses } from '../../helpers/component/types';

/**
 * Default classes for the `navigation` theme entry. Shared between
 * `<VCNavItems>` (the container) and `<VCNavItem>` (the per-row
 * component) — both call `useComponentTheme('navigation', …)` with
 * the same slot defaults, so the source of truth lives here.
 */
export const navigationThemeDefaults: ComponentThemeDefinition<NavigationThemeClasses> = {
    classes: {
        group: 'vc-nav-items',
        item: 'vc-nav-item',
        itemNested: 'vc-nav-item-nested',
        separator: 'vc-nav-separator',
        link: 'vc-nav-link',
        linkRoot: 'vc-nav-link-root',
        linkIcon: 'vc-nav-link-icon',
        linkText: 'vc-nav-link-text',
    },
};
