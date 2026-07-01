import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Component, Plugin } from 'vue';

import '../assets/index.css';
import './vue';
import { NavigationRegistry, provideNavigationRegistry } from './registry';

import {
    VCBreadcrumb,
    VCBreadcrumbEllipsis,
    VCBreadcrumbItem,
    VCBreadcrumbLink,
    VCBreadcrumbList,
    VCBreadcrumbPage,
    VCBreadcrumbSeparator,
    VCNavItem,
    VCNavItems,
    VCStepper,
    VCStepperDescription,
    VCStepperIndicator,
    VCStepperItem,
    VCStepperSeparator,
    VCStepperTitle,
    VCStepperTrigger,
    provideBreadcrumbLeafRegistry,
    provideBreadcrumbManager,
} from './components';
import type { Options } from './types';

export * from './components';
export * from './registry';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    provideNavigationRegistry(new NavigationRegistry(), instance);
    // App-scoped breadcrumb manager + leaf registry (not module singletons —
    // a singleton would leak the trail across concurrent SSR requests).
    provideBreadcrumbManager(undefined, instance);
    provideBreadcrumbLeafRegistry(undefined, instance);

    installThemeManager(instance, options);
    installDefaultsManager(instance, options);

    Object.entries({
        VCBreadcrumb,
        VCBreadcrumbList,
        VCBreadcrumbItem,
        VCBreadcrumbLink,
        VCBreadcrumbPage,
        VCBreadcrumbSeparator,
        VCBreadcrumbEllipsis,
        VCNavItem,
        VCNavItems,
        VCStepper,
        VCStepperItem,
        VCStepperTrigger,
        VCStepperIndicator,
        VCStepperTitle,
        VCStepperDescription,
        VCStepperSeparator,
        // `VCBreadcrumb` is exported as a generic-over-`Item` function type,
        // which isn't structurally a Vue `Component` — cast back for registration.
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component as Component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
