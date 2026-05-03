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
        name: 'Admin',
        icon: 'fa6-solid:gear',
        activeMatch: '/admin/',
    },
];

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

            return secondaryDefaultItems;
        }
    }

    return [];
}
