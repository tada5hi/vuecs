import {LayoutKey, LayoutProviderInterface} from "../src";
import {Component, ComponentLevelName} from '../src';

export class LayoutProvider implements LayoutProviderInterface {
    protected items : Record<ComponentLevelName, Component[]> = {
        'level-0': [
            {
                id: 'default',
                name: 'Home',
                icon: 'fa fa-home',
                components: [
                    {
                        name: 'About'
                    }
                ]
            },
            {
                id: 'admin',
                name: 'Admin',
                icon: 'fas fa-cog',
                [LayoutKey.REQUIRED_LOGGED_IN]: true,
                [LayoutKey.REQUIRED_PERMISSIONS]: []
            }
        ]
    };

    async getComponent(level: ComponentLevelName, id: string): Promise<Component | undefined> {
        if(!this.items.hasOwnProperty(level)) {
            return undefined;
        }

        const index = this.items[level].findIndex(item => item.id === id);
        if(index === -1) {
            return undefined;
        }

        return this.items[level][index];
    }

    async getComponents(level: ComponentLevelName): Promise<Component[]> {
        return this.items[level] || [];
    }

    async hasLevel(level: ComponentLevelName): Promise<boolean> {
        return this.items.hasOwnProperty(level);
    }

}
