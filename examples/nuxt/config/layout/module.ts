import type {
    NavigationItem,
    NavigationItemNormalized,
} from '@vuecs/navigation';

/*
 * Navigation config — drives both the top header (level 0) and the
 * left sidebar (level 1) via a single `<VCNavItems>` instance per
 * level. NavigationManager calls `findNavigationItems(level, parent)`
 * once per level per parent; the sidebar's children arrays nest one
 * more layer so the multi-level rendering path of `<VCNavItems>` is
 * exercised. Different top-level entries return different sidebar
 * items via the `parent` arg — Home shows the component catalog,
 * Admin shows admin links.
 */

const primaryItems: NavigationItem[] = [
    {
        name: 'Home',
        icon: 'fa6-solid:house',
        url: '/',
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
        name: 'Timeago',
        type: 'link',
        icon: 'fa6-solid:hourglass',
        url: '/timeago',
    },
];

const elementsItems: NavigationItem[] = [
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
        name: 'Tooltip', 
        type: 'link', 
        url: '/overlays/tooltip', 
    },
];

// Sidebar list shown under "Home" (level 1, default branch). Mixes
// flat links (the six standalone components) with nested groups
// (Elements / Forms / List / Navigation / Overlays — each expands to
// its own children so `<VCNavItems>`'s multi-level rendering path is
// exercised).
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

// Sidebar list shown under "Admin" (level 1, admin branch).
// Demonstrates that `<VCNavItems>` returns different items per
// top-level parent — switching from Home to Admin in the header
// swaps the entire sidebar.
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

export async function findNavigationItems(
    level: number,
    parent?: NavigationItemNormalized,
): Promise<NavigationItem[]> {
    if (level === 0) {
        return primaryItems;
    }

    if (level === 1) {
        if (parent?.name === 'Admin') {
            return secondaryAdminItems;
        }

        return secondaryDefaultItems;
    }

    return [];
}
