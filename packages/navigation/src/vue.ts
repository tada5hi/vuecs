import type {
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
} from './components';

declare module 'vue' {
    export interface GlobalComponents {
        VCBreadcrumb: typeof VCBreadcrumb,
        VCBreadcrumbList: typeof VCBreadcrumbList,
        VCBreadcrumbItem: typeof VCBreadcrumbItem,
        VCBreadcrumbLink: typeof VCBreadcrumbLink,
        VCBreadcrumbPage: typeof VCBreadcrumbPage,
        VCBreadcrumbSeparator: typeof VCBreadcrumbSeparator,
        VCBreadcrumbEllipsis: typeof VCBreadcrumbEllipsis,
        VCNavItem: typeof VCNavItem,
        VCNavItems: typeof VCNavItems,
        VCStepper: typeof VCStepper,
        VCStepperItem: typeof VCStepperItem,
        VCStepperTrigger: typeof VCStepperTrigger,
        VCStepperIndicator: typeof VCStepperIndicator,
        VCStepperTitle: typeof VCStepperTitle,
        VCStepperDescription: typeof VCStepperDescription,
        VCStepperSeparator: typeof VCStepperSeparator,
    }
}
