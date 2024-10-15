import type {
    NavigationItem,
    NavigationItemNormalized,
} from '@vuecs/navigation';

const primaryItems : NavigationItem[] = [
    {
        name: 'Home', icon: 'fa fa-home',
    },
    {
        name: 'Admin', icon: 'fas fa-cog', activeMatch: '/admin/',
    },
];

const secondaryDefaultItems : NavigationItem[] = [
    {
        name: 'Home', type: 'link', icon: 'fas fa-home', url: '/',
    },

    {
        name: 'Controls',
        type: 'separator',
    },
    {
        name: 'Form Controls',
        type: 'link',
        icon: 'fa-solid fa-bars',
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
        name: 'List Controls',
        type: 'link',
        icon: 'fa-solid fa-bars',
        children: [
            { name: 'default', url: '/list-controls/list' },
            { name: 'Slot', url: '/list-controls/list-slot' },
        ],
    },
    {
        name: 'General',
        type: 'separator',
    },
    {
        name: 'Countdown', type: 'link', icon: 'fa-solid fa-clock', url: '/countdown',
    },
    {
        name: 'Pagination', type: 'link', icon: 'fa-solid fa-road', url: '/pagination',
    },
    {
        name: 'Timeago', type: 'link', icon: 'fa-solid fa-clock', url: '/timeago',
    },
];

const secondaryAdminItems : NavigationItem[] = [
    {
        name: 'Auth',
        children: [
            {
                name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university',
            },
        ],
    },

];

export async function findNavigationItems(
    tier: number,
    parent?: NavigationItemNormalized,
) : Promise<NavigationItem[]> {
    if (tier === 0) {
        return primaryItems;
    }

    if (parent) {
        if (tier === 1) {
            if (parent.name === 'Admin') {
                return secondaryAdminItems;
            }

            return secondaryDefaultItems;
        }
    }

    return [];
}
