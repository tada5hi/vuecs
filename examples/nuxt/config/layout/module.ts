import { sharedRoutes } from '@vuecs-examples/shared/routes';
import type {
    NavigationItem,
    NavigationItemNormalized,
} from '@vuecs/navigation';

const primaryItems : NavigationItem[] = [
    {
        name: 'Home',
        icon: 'fa6-solid:house',
        url: '/',
    },
    {
        name: 'Components',
        icon: 'fa6-solid:cube',
        activeMatch: '/components/',
    },
    {
        name: 'Admin',
        icon: 'fa6-solid:gear',
        activeMatch: '/admin/',
    },
];

// Sidebar list shown under the "Home" group — keeps the rich, custom-flow
// pages (vuelidate-driven form-controls, bespoke list/overlays demos) that
// the example app has historically demonstrated.
const secondaryDefaultItems : NavigationItem[] = [
    {
        name: 'Home',
        type: 'link',
        icon: 'fa6-solid:house',
        url: '/',
    },

    {
        name: 'Controls',
        type: 'separator',
    },
    {
        name: 'Form Controls',
        type: 'link',
        icon: 'fa6-solid:bars',
        children: [
            { name: 'Input Checkbox', url: '/form-controls/input-checkbox' },
            { name: 'Input Text', url: '/form-controls/input-text' },
            { name: 'Range Multi Slider', url: '/form-controls/range-multi-slider' },
            { name: 'Select', url: '/form-controls/select' },
            { name: 'Select Search', url: '/form-controls/select-search' },
            { name: 'Submit', url: '/form-controls/submit' },
            { name: 'Textarea', url: '/form-controls/textarea' },
        ],
    },
    {
        name: 'List',
        type: 'link',
        icon: 'fa6-solid:list',
        children: [
            { name: 'default', url: '/list/list' },
            { name: 'Slot', url: '/list/list-slot' },
        ],
    },
    {
        name: 'General',
        type: 'separator',
    },
    {
        name: 'Countdown',
        type: 'link',
        icon: 'fa6-solid:clock',
        url: '/countdown',
    },
    {
        name: 'Pagination',
        type: 'link',
        icon: 'fa6-solid:road',
        url: '/pagination',
    },
    {
        name: 'Overlays',
        type: 'link',
        icon: 'fa6-solid:window-restore',
        url: '/overlays',
    },
    {
        name: 'Timeago',
        type: 'link',
        icon: 'fa6-solid:clock',
        url: '/timeago',
    },
];

// Auto-generated from the shared route list — every shared view appears
// in the sidebar without per-item wiring. Adding a view to
// `examples/_shared/src/routes.ts` is the only change needed.
const sharedComponentItems : NavigationItem[] = sharedRoutes.map((route) => ({
    name: route.label,
    type: 'link',
    url: `/components/${route.name}`,
}));

const secondaryAdminItems : NavigationItem[] = [
    {
        name: 'Auth',
        children: [
            {
                name: 'Realms',
                type: 'link',
                url: '/admin/realms',
                icon: 'fa6-solid:university',
            },
        ],
    },

];

export async function findNavigationItems(
    level: number,
    parent?: NavigationItemNormalized<{ foo: string }>,
) : Promise<NavigationItem[]> {
    if (level === 0) {
        return primaryItems;
    }

    if (parent) {
        if (level === 1) {
            if (parent.name === 'Admin') {
                return secondaryAdminItems;
            }

            if (parent.name === 'Components') {
                return sharedComponentItems;
            }

            return secondaryDefaultItems;
        }
    }

    return [];
}
