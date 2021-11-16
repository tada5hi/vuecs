import {LayoutProviderContext, LayoutProviderInterface} from "../src";
import {Component, ComponentLevel} from '../src';

export class LayoutProvider implements LayoutProviderInterface {
    protected primaryItems : Component[] = [
        {id: 'default', name: 'Home', icon: 'fa fa-home'},
        {id: 'admin', name: 'Admin', icon: 'fas fa-cog'}
    ];

    // -------------------------

    protected secondaryDefaultItems : Component[] = [
        {name: 'Info', type: 'link', icon: 'fas fa-info', components: [{name: 'About', url: '/about'}], rootLink: true}
    ];

    protected secondaryAdminItems : Component[] = [
        {name: 'Realms', type: 'link', url: '/admin/realms', icon: 'fas fa-university'}
    ];

    // ---------------------------

    async getComponent(level: ComponentLevel, id: string, context: LayoutProviderContext): Promise<Component | undefined> {
        const components = await this.getComponents(level, context);
        if(components.length === 0) {
            return undefined;
        }

        const index = components.findIndex(component => component.id === id);
        if(index === -1) {
            return undefined;
        }

        return components[index];
    }

    async getComponents(level: ComponentLevel, context: LayoutProviderContext): Promise<Component[]> {
        if(!await this.hasLevel(level)) {
            return [];
        }

        let items : Component[] = [];

        switch (level) {
            case 0:
                items = this.primaryItems;
                break;
            case 1:
                const id = context.components.length >= 1 ?
                    context.components[0].id ?? 'default' :
                    'default';

                switch (id) {
                    case 'default':
                        items = this.secondaryDefaultItems;
                        break;
                    case 'admin':
                        items = this.secondaryAdminItems;
                        break;

                }

                break;
        }

        return items;
    }

    async hasLevel(level: ComponentLevel): Promise<boolean> {
        return [0, 1].indexOf(level) !== -1;
    }

    async getContextForUrl(url: string): Promise<LayoutProviderContext | undefined> {
        const context : LayoutProviderContext = {
            components: []
        };

        const sortFunc = (a: Component, b: Component) => {
            return (b.url?.length ?? 0) - (a.url?.length ?? 0);
        };
        const filterFunc = (item: Component) => {
            return !!item.url && (url.startsWith(item.url) || url === item.url);
        };

        // ------------------------

        const secondaryDefaultItems = this.flatternNestedComponents(this.secondaryDefaultItems)
            .sort(sortFunc)
            .filter(filterFunc);
        const secondaryAdminItems = this.flatternNestedComponents(this.secondaryAdminItems)
            .sort(sortFunc)
            .filter(filterFunc);

        if(
            secondaryDefaultItems.length === 0 &&
            secondaryAdminItems.length === 0
        ) {
            return context;
        }

        const isAdminItem = secondaryAdminItems.length > 0;
        const secondaryItem : Component = isAdminItem ? secondaryAdminItems[0] : secondaryDefaultItems[0];

        const primaryItem = this.primaryItems.filter(item => !!item?.id && item.id === (isAdminItem ? 'admin' : 'default')).pop();

        if(typeof primaryItem === 'undefined') {
            return context;
        }

        context.components.push(primaryItem);
        context.components.push(secondaryItem);

        return context;
    }

    // ----------------------------------------------------

    private flatternNestedComponents(components: Component[]) : Component[] {
        let output = [...components];

        components.map(component => {
            if(component.components) {
                output.push(...this.flatternNestedComponents(component.components));
            }
        });

        return output;
    }
}
