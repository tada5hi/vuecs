import type {
    NavigationElement,
    NavigationProvider,
} from '@vue-layout/navigation';
import {
    flattenNestedNavigationElements,
} from '@vue-layout/navigation';

const primaryItems : NavigationElement[] = [
    {
        id: 'default', name: 'Home', icon: 'fa fa-home', default: true,
    },
    {
        id: 'admin', name: 'Admin', icon: 'fas fa-cog',
    },
];

const secondaryDefaultItems : NavigationElement[] = [
    {
        name: 'Home', type: 'link', icon: 'fas fa-home', url: '/', rootLink: true,
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

const secondaryAdminItems : NavigationElement[] = [
    {
        name: 'Auth',
        children: [
            {
                name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university',
            },
        ],
    },

];

export const navigationProvider : NavigationProvider = {
    hasTier(tier: number): Promise<boolean> {
        return Promise.resolve([0, 1].indexOf(tier) !== -1);
    },
    async getElements(tier: number, elementsActive: NavigationElement[]): Promise<NavigationElement[]> {
        if (!await this.hasTier(tier)) {
            return [];
        }

        let items : NavigationElement[] = [];

        switch (tier) {
            case 0:
                items = primaryItems;
                break;
            case 1: {
                let component : NavigationElement;
                if (elementsActive.length > 0) {
                    [component] = elementsActive;
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
    async getElementsActiveByURL(url: string): Promise<NavigationElement[]> {
        const sortFunc = (a: NavigationElement, b: NavigationElement) => (b.url?.length ?? 0) - (a.url?.length ?? 0);
        const filterFunc = (item: NavigationElement) => {
            if (!item.url) return false;

            if (item.rootLink) {
                return url === item.url;
            }

            return url === item.url || url.startsWith(item.url);
        };

        // ------------------------

        let items = flattenNestedNavigationElements([...secondaryDefaultItems])
            .sort(sortFunc)
            .filter(filterFunc);

        if (items.length > 0) {
            return [
                primaryItems[0],
                items[0],
            ];
        }

        items = flattenNestedNavigationElements([...secondaryAdminItems])
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
};
