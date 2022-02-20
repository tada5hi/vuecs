import {
    Component,
    ComponentsActive,
    ProviderInterface,
} from '@vue-layout/navigation';

export class NavigationProvider implements ProviderInterface {
    protected primaryItems : Component[] = [
        {
            id: 'default', name: 'Home', icon: 'fa fa-home', default: true,
        },
        { id: 'admin', name: 'Admin', icon: 'fas fa-cog' },
    ];

    // -------------------------

    protected secondaryDefaultItems : Component[] = [
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

    protected secondaryAdminItems : Component[] = [
        {
            name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university',
        },
    ];

    // ---------------------------

    async getComponents(tier: number, context: ComponentsActive): Promise<Component[]> {
        if (!await this.hasTier(tier)) {
            return [];
        }

        let items : Component[] = [];

        switch (tier) {
            case 0:
                items = this.primaryItems;
                break;
            case 1: {
                const component : Component = context[0] || { id: 'default' };
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

    async getComponentsActive(url: string): Promise<ComponentsActive> {
        const sortFunc = (a: Component, b: Component) => (b.url?.length ?? 0) - (a.url?.length ?? 0);
        const filterFunc = (item: Component) => !!item.url && (url.startsWith(item.url) || url === item.url);

        // ------------------------

        const secondaryDefaultItems = this.flattenNestedComponents(this.secondaryDefaultItems)
            .sort(sortFunc)
            .filter(filterFunc);

        const secondaryAdminItems = this.flattenNestedComponents(this.secondaryAdminItems)
            .sort(sortFunc)
            .filter(filterFunc);

        if (
            secondaryDefaultItems.length === 0 &&
            secondaryAdminItems.length === 0
        ) {
            return { };
        }

        const isAdminItem = secondaryAdminItems.length > 0;
        const secondaryItem : Component = isAdminItem ? secondaryAdminItems[0] : secondaryDefaultItems[0];

        const primaryItem = this.primaryItems.filter((item) => !!item?.id && item.id === (isAdminItem ? 'admin' : 'default')).pop();

        if (typeof primaryItem === 'undefined') {
            return { };
        }

        return {
            0: primaryItem,
            1: secondaryItem,
        };
    }

    // ----------------------------------------------------

    private flattenNestedComponents(components: Component[]) : Component[] {
        const output = [...components];

        for (let i = 0; i < components.length; i++) {
            if (components[i].components) {
                output.push(...this.flattenNestedComponents(components[i].components));
            }
        }

        return output;
    }
}
