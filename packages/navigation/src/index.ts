import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';
import { NavigationManager, provideNavigationManager } from './manager';

import {
    VCNavItem,
    VCNavItems,
    VCStepper,
    VCStepperDescription,
    VCStepperIndicator,
    VCStepperItem,
    VCStepperSeparator,
    VCStepperTitle,
    VCStepperTrigger,
} from './components';
import type { Options } from './types';

export * from './components';
export * from './manager';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    const manager = new NavigationManager({ items: options.items ?? [] });
    provideNavigationManager(manager, instance);

    installThemeManager(instance, options);
    installDefaultsManager(instance, options);

    Object.entries({
        VCNavItem,
        VCNavItems,
        VCStepper,
        VCStepperItem,
        VCStepperTrigger,
        VCStepperIndicator,
        VCStepperTitle,
        VCStepperDescription,
        VCStepperSeparator,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
