import type {
    VCNavItem,
    VCNavItems,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCNavItem: typeof VCNavItem,
        VCNavItems: typeof VCNavItems,
    }
}
