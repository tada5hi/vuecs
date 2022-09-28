import {
    NavigationElement,
    ProviderInterface,
    findTierComponent,
} from '@vue-layout/basic';

export class Provider implements ProviderInterface {
    protected primaryItems : NavigationElement[] = [
        {
            id: 'default', name: 'Home', icon: 'fa fa-home', default: true,
        },
        {
            id: 'admin', name: 'Admin', icon: 'fas fa-cog',
        },
    ];

    // -------------------------

    protected secondaryDefaultItems : NavigationElement[] = [
        {
            name: 'Home', type: 'link', icon: 'fas fa-home', url: '/', rootLink: true,
        },
        {
            name: 'Info', type: 'link', icon: 'fas fa-info', components: [{ name: 'About', url: '/about' }],
        },
        {
            name: 'Sonstige', type: 'link', icon: 'fas fa-bars', components: [{ name: 'Settings', url: '/settings' }],
        },
    ];

    protected secondaryAdminItems : NavigationElement[] = [
        {
            name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university',
        },
    ];

    // ---------------------------

    async getComponents(tier: number, components: NavigationElement[]): Promise<NavigationElement[]> {
        if (!await this.hasTier(tier)) {
            return [];
        }

        let items : NavigationElement[] = [];

        switch (tier) {
            case 0:
                items = this.primaryItems;
                break;
            case 1: {
                const component : NavigationElement = findTierComponent(components, 0) || { id: 'default' };
                switch (component.id) {
                    case 'default':
                        items = this.secondaryDefaultItems;
                        break;
                    case 'admin':
                        items = this.secondaryAdminItems;
                        break;
                }

                break;
            }
        }

        return items;
    }

    async hasTier(tier: number): Promise<boolean> {
        return [0, 1].indexOf(tier) !== -1;
    }

    async getComponentsActive(url: string): Promise<NavigationElement[]> {
        const sortFunc = (a: NavigationElement, b: NavigationElement) => (b.url?.length ?? 0) - (a.url?.length ?? 0);
        const filterFunc = (item: NavigationElement) => {
            if (!item.url) return false;

            if (item.rootLink) {
                return url === item.url;
            }

            return url === item.url || url.startsWith(item.url);
        };

        // ------------------------

        const secondaryDefaultItems = this.flattenNestedComponents(this.secondaryDefaultItems)
            .sort(sortFunc)
            .filter(filterFunc);

        if (secondaryDefaultItems.length > 0) {
            return [
                this.primaryItems[0],
                secondaryDefaultItems[0],
            ];
        }

        const secondaryAdminItems = this.flattenNestedComponents(this.secondaryAdminItems)
            .sort(sortFunc)
            .filter(filterFunc);

        if (secondaryAdminItems.length > 0) {
            return [
                this.primaryItems[1],
                secondaryAdminItems[0],
            ];
        }

        return [];
    }

    // ----------------------------------------------------

    private flattenNestedComponents(components: NavigationElement[]) : NavigationElement[] {
        const output = [...components];

        for (let i = 0; i < components.length; i++) {
            if (components[i].components) {
                output.push(...this.flattenNestedComponents(components[i].components));
            }
        }

        return output;
    }
}
