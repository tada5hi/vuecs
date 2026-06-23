import type {
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
