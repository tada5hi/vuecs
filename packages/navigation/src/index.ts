import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/index.css';
import './vue';
import { NavigationRegistry, provideNavigationRegistry } from './registry';

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
export * from './registry';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    provideNavigationRegistry(new NavigationRegistry(), instance);

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
