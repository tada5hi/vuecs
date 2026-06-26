import { h, resolveComponent } from 'vue';
import type { VNodeChild } from 'vue';

/**
 * Render an icon string the same way `<VCNavItem>` does (no hard
 * `@vuecs/icon` dependency): Iconify-style names (containing a colon,
 * e.g. `lucide:chevron-right`) go through the globally-registered
 * `<VCIcon>`; legacy class-string icons (`fa fa-home`) render as a
 * literal `<i class>`.
 */
export function renderBreadcrumbIcon(icon: string): VNodeChild {
    if (icon.includes(':')) {
        return h(resolveComponent('VCIcon'), { name: icon });
    }
    return h('i', { class: icon });
}
