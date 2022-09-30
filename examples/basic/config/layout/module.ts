import {
    NavigationElement,
    NavigationProvider,
    findNavigationElementForTier,
    flattenNestedNavigationElements,
} from '@vue-layout/basic';

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
        name: 'Components',
        type: 'link',
        icon: 'fa-solid fa-bars',
        children: [
            {
                name: 'Countdown', type: 'link', icon: 'fa-solid fa-clock', url: '/countdown',
            },
            {
                name: 'Pagination', type: 'link', icon: 'fa-solid fa-road', url: '/pagination',
            },
        ],
    },
    {
        name: 'Info',
        type: 'link',
        icon: 'fas fa-info',
        url: '/about',
    },
];

const secondaryAdminItems : NavigationElement[] = [
    {
        name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university',
    },
];

export const navigationProvider : NavigationProvider = {
    hasTier(tier: number): Promise<boolean> {
        return Promise.resolve([0, 1].indexOf(tier) !== -1);
    },
    async getElements(tier: number, elements: NavigationElement[]): Promise<NavigationElement[]> {
        if (!await this.hasTier(tier)) {
            return [];
        }

        let items : NavigationElement[] = [];

        switch (tier) {
            case 0:
                items = primaryItems;
                break;
            case 1: {
                const component : NavigationElement = findNavigationElementForTier(elements, 0) || { id: 'default' };
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
    async getElementsActive(url: string): Promise<NavigationElement[]> {
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
