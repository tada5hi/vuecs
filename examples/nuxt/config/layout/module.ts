import type {
    NavigationItem,
} from '@vuecs/navigation';
import {
    createNavigationProvider,
    flattenNestedNavigationItems,
} from '@vuecs/navigation';

const primaryItems : NavigationItem[] = [
    {
        id: 'default', name: 'Home', icon: 'fa fa-home', default: true,
    },
    {
        id: 'admin', name: 'Admin', icon: 'fas fa-cog',
    },
];

const secondaryDefaultItems : NavigationItem[] = [
    {
        name: 'Home', type: 'link', icon: 'fas fa-home', url: '/', root: true,
    },
    {
        name: 'Countdown', type: 'link', icon: 'fa-solid fa-clock', url: '/countdown',
    },
    {
        name: 'Form Controls',
        type: 'link',
        icon: 'fa-solid fa-bars',
        children: [
            { name: 'Input Checkbox', url: '/form-controls/input-checkbox' },
            { name: 'Input Text', url: '/form-controls/input-text' },
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

export const navigationProvider = createNavigationProvider({
    async getItems(tier: number, itemsActive: NavigationItem[]) {
        if (tier > 1) {
            return undefined;
        }

        let items : NavigationItem[] = [];

        switch (tier) {
            case 0:
                items = primaryItems;
                break;
            case 1: {
                let component : NavigationItem;
                if (itemsActive.length > 0) {
                    [component] = itemsActive;
                } else {
                    component = { id: 'default' };
                }

                switch (component.id) {
                    case 'default':
                        items = secondaryDefaultItems;
                        break;
                    case 'admin':
                        items = secondaryAdminItems;
                        break;
                }

                break;
            }
        }

        return items;
    },
    async getItemsActiveByURL(url: string) {
        const sortFunc = (a: NavigationItem, b: NavigationItem) => (b.url?.length ?? 0) - (a.url?.length ?? 0);
        const filterFunc = (item: NavigationItem) => {
            if (!item.url) return false;

            if (item.root) {
                return url === item.url;
            }

            return url === item.url || url.startsWith(item.url);
        };

        // ------------------------

        let items = flattenNestedNavigationItems([...secondaryDefaultItems])
            .sort(sortFunc)
            .filter(filterFunc);

        if (items.length > 0) {
            return [
                primaryItems[0],
                items[0],
            ];
        }

        items = flattenNestedNavigationItems([...secondaryAdminItems])
            .sort(sortFunc)
            .filter(filterFunc);

        if (items.length > 0) {
            return [
                primaryItems[1],
                items[0],
            ];
        }

        return [];
    },
});
