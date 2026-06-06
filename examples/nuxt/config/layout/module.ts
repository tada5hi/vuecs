import type { NavigationItem } from '@vuecs/navigation';

/*
 * Navigation config — drives the top header and the left sidebar as TWO
 * independent `<VCNavItems>` call sites:
 *
 *   - The header nav owns `primaryItems` and publishes its resolved
 *     output into the registry under the id `top`.
 *   - The sidebar nav is *dependent*: its resolver reads
 *     `registry('top').activeTrail` to learn which top section is active,
 *     then supplies its OWN item list via `sideItemsFor(name)`. It never
 *     borrows the header's `.children` subtree — each call site owns the
 *     items it renders.
 */

export const primaryItems: NavigationItem[] = [
    {
        name: 'Home',
        icon: 'fa6-solid:house',
    },
    {
        name: 'Admin',
        icon: 'fa6-solid:gear',
        activeMatch: '/admin/',
    },
];

const generalItems: NavigationItem[] = [
    {
        name: 'Button',
        type: 'link',
        icon: 'fa6-solid:square',
        url: '/button',
    },
    {
        name: 'Countdown',
        type: 'link',
        icon: 'fa6-solid:clock',
        url: '/countdown',
    },
    {
        name: 'Gravatar',
        type: 'link',
        icon: 'fa6-solid:user',
        url: '/gravatar',
    },
    {
        name: 'Link',
        type: 'link',
        icon: 'fa6-solid:link',
        url: '/link',
    },
    {
        name: 'Pagination',
        type: 'link',
        icon: 'fa6-solid:road',
        url: '/pagination',
    },
    {
        name: 'Placeholder',
        type: 'link',
        icon: 'fa6-solid:ellipsis',
        url: '/placeholder',
    },
    {
        name: 'Table',
        type: 'link',
        icon: 'fa6-solid:table',
        url: '/table',
    },
    {
        name: 'Timeago',
        type: 'link',
        icon: 'fa6-solid:hourglass',
        url: '/timeago',
    },
];

const elementsItems: NavigationItem[] = [
    {
        name: 'Alert',
        type: 'link',
        url: '/elements/alert',
    },
    {
        name: 'Aspect Ratio',
        type: 'link',
        url: '/elements/aspect-ratio',
    },
    {
        name: 'Avatar',
        type: 'link',
        url: '/elements/avatar',
    },
    {
        name: 'Badge',
        type: 'link',
        url: '/elements/badge',
    },
    {
        name: 'Card',
        type: 'link',
        url: '/elements/card',
    },
    {
        name: 'Collapse',
        type: 'link',
        url: '/elements/collapse',
    },
    {
        name: 'Separator',
        type: 'link',
        url: '/elements/separator',
    },
    {
        name: 'Tag',
        type: 'link',
        url: '/elements/tag',
    },
    {
        name: 'Visually Hidden',
        type: 'link',
        url: '/elements/visually-hidden',
    },
];

const formsItems: NavigationItem[] = [
    {
        name: 'Checkbox',
        type: 'link',
        url: '/forms/checkbox',
    },
    {
        name: 'Group (severity)',
        type: 'link',
        url: '/forms/group',
    },
    {
        name: 'Input',
        type: 'link',
        url: '/forms/input',
    },
    {
        name: 'Number',
        type: 'link',
        url: '/forms/number',
    },
    {
        name: 'Pin',
        type: 'link',
        url: '/forms/pin',
    },
    {
        name: 'Radio',
        type: 'link',
        url: '/forms/radio',
    },
    {
        name: 'Select',
        type: 'link',
        url: '/forms/select',
    },
    {
        name: 'Select Search',
        type: 'link',
        url: '/forms/select-search',
    },
    {
        name: 'Select Search (Multiple)',
        type: 'link',
        url: '/forms/select-search-multiple',
    },
    {
        name: 'Slider',
        type: 'link',
        url: '/forms/slider',
    },
    {
        name: 'Switch',
        type: 'link',
        url: '/forms/switch',
    },
    {
        name: 'Tags',
        type: 'link',
        url: '/forms/tags',
    },
    {
        name: 'Textarea',
        type: 'link',
        url: '/forms/textarea',
    },
];

const listItems: NavigationItem[] = [
    {
        name: 'List',
        type: 'link',
        url: '/list/list',
    },
];

const navigationItems: NavigationItem[] = [
    {
        name: 'Nav Items',
        type: 'link',
        url: '/navigation/items',
    },
    {
        name: 'Stepper',
        type: 'link',
        url: '/navigation/stepper',
    },
];

const overlaysItems: NavigationItem[] = [
    {
        name: 'Context Menu',
        type: 'link',
        url: '/overlays/context-menu',
    },
    {
        name: 'Dropdown Menu',
        type: 'link',
        url: '/overlays/dropdown-menu',
    },
    {
        name: 'Hover Card',
        type: 'link',
        url: '/overlays/hover-card',
    },
    {
        name: 'Modal',
        type: 'link',
        url: '/overlays/modal',
    },
    {
        name: 'Modal View Stack',
        type: 'link',
        url: '/overlays/modal-view-stack',
    },
    {
        name: 'Popover',
        type: 'link',
        url: '/overlays/popover',
    },
    {
        name: 'Toast',
        type: 'link',
        url: '/overlays/toast',
    },
    {
        name: 'Tooltip',
        type: 'link',
        url: '/overlays/tooltip',
    },
];

// Sidebar list shown when the "Home" top section is active. Mixes flat
// links (the standalone components) with nested groups (Elements / Forms
// / List / Navigation / Overlays — each expands its own children inline
// as a collapse submenu, so `<VCNavItems>`'s multi-level rendering path
// is exercised).
const secondaryDefaultItems: NavigationItem[] = [
    {
        name: 'Home',
        type: 'link',
        icon: 'fa6-solid:house',
        url: '/',
    },
    {
        name: 'General',
        type: 'separator',
    },
    ...generalItems,
    {
        name: 'Categories',
        type: 'separator',
    },
    {
        name: 'Elements',
        type: 'link',
        icon: 'fa6-solid:shapes',
        children: elementsItems,
    },
    {
        name: 'Forms',
        type: 'link',
        icon: 'fa6-solid:bars',
        children: formsItems,
    },
    {
        name: 'List',
        type: 'link',
        icon: 'fa6-solid:list',
        children: listItems,
    },
    {
        name: 'Navigation',
        type: 'link',
        icon: 'fa6-solid:route',
        children: navigationItems,
    },
    {
        name: 'Overlays',
        type: 'link',
        icon: 'fa6-solid:window-restore',
        children: overlaysItems,
    },
];

// Sidebar list shown when the "Admin" top section is active.
// Demonstrates that the dependent sidebar swaps its entire item list
// based on which top section the header reports as active.
const secondaryAdminItems: NavigationItem[] = [
    {
        name: 'Admin',
        type: 'separator',
    },
    {
        name: 'Realms',
        type: 'link',
        icon: 'fa6-solid:building-columns',
        url: '/admin/realms',
    },
];

/**
 * Map the active top-section name (read from the header nav's published
 * `activeTrail[0]`) to the sidebar's own item list. The sidebar's
 * resolver calls this — it derives its items, never renders another
 * nav's children.
 */
export function sideItemsFor(activeSection?: string): NavigationItem[] {
    if (activeSection === 'Admin') {
        return secondaryAdminItems;
    }

    return secondaryDefaultItems;
}
