import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { Component, PropType } from 'vue';
import type { NavigationItemNormalized, NavigationOrientation, NavigationSubmenuMode } from '../../types';
import type { NavigationThemeClasses } from '../../helpers/component/types';

export const navItemProps = {
    data: {
        type: Object as PropType<NavigationItemNormalized>,
        required: true,
    },
    variant: {
        type: String,
        default: undefined,
    },
    orientation: {
        type: String as PropType<NavigationOrientation>,
        default: undefined,
    },
    /**
     * Resolved submenu presentation handed down by the parent
     * `<VCNavItems>`. `collapse` renders groups as an inline
     * Reka `Collapsible`; `dropdown` renders them as Reka
     * `NavigationMenu` flyouts.
     */
    submenu: {
        type: String as PropType<NavigationSubmenuMode>,
        default: 'collapse',
    },
    /**
     * The tag (or component) this item renders as — its own wrapper
     * (`<li>` by default). Receives `<VCNavItems>`' `itemAs`. Honored in
     * collapse mode only.
     */
    as: {
        type: [String, Object, Function] as PropType<string | Component>,
        default: 'li',
    },
    /**
     * The list-container tag for this item's nested submenu
     * `<VCNavItems>` (`<ul>` by default). Receives `<VCNavItems>`' `as`.
     * Honored in collapse mode only.
     */
    itemsAs: {
        type: [String, Object, Function] as PropType<string | Component>,
        default: 'ul',
    },
    themeClass: {
        type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>,
        default: undefined,
    },
    themeVariant: {
        type: Object as PropType<VariantValues>,
        default: undefined,
    },
};
