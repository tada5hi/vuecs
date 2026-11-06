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

export {
    NAVIGATION_NODES_KEY,
    NAVIGATION_SELECT_KEY,
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
    breadcrumbBehavioralDefaults,
    breadcrumbItemThemeDefaults,
    breadcrumbSeparatorThemeDefaults,
    breadcrumbThemeDefaults,
    createBreadcrumbManager,
    injectBreadcrumbLeafRegistry,
    navigationThemeDefaults,
    provideBreadcrumbContext,
    provideBreadcrumbLeafRegistry,
    provideBreadcrumbManager,
    provideStepperContext,
    stepperThemeDefaults,
    useBreadcrumb,
    useBreadcrumbContext,
    useBreadcrumbFromRegistry,
    useBreadcrumbItems,
    useBreadcrumbLeaf,
    useStepperContext,
} from './components';
export type {
    BreadcrumbEllipsisProps,
    BreadcrumbItemProps,
    BreadcrumbItemSlotProps,
    BreadcrumbLinkProps,
    BreadcrumbListProps,
    BreadcrumbPageProps,
    BreadcrumbProps,
    BreadcrumbPropsGeneric,
    BreadcrumbSeparatorProps,
    BreadcrumbSlots,
    StepperDescriptionProps,
    StepperIndicatorProps,
    StepperItemProps,
    StepperItemSlotProps,
    StepperProps,
    StepperSeparatorProps,
    StepperTitleProps,
    StepperTriggerProps,
    VCBreadcrumbComponent,
} from './components';
export type {
    BreadcrumbContext,
    BreadcrumbDefaults,
    BreadcrumbItem,
    BreadcrumbItemThemeClasses,
    BreadcrumbLeafHandle,
    BreadcrumbLeafRegistry,
    BreadcrumbManager,
    BreadcrumbMeta,
    BreadcrumbSeparatorThemeClasses,
    BreadcrumbThemeClasses,
    NavItemLinkSlotProps,
    NavItemProps,
    NavItemSelectFn,
    NavItemSeparatorSlotProps,
    NavItemSubItemsSlotProps,
    NavItemSubSlotProps,
    NavItemSubTitleSlotProps,
    NavItemToggleFn,
    NavItemsItemSlotProps,
    NavItemsProps,
    NavigationSelectContext,
    StepperContext,
    StepperThemeClasses,
    UseBreadcrumbItemsOptions,
} from './components';
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
