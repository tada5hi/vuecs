import type {
    VCPlaceholder,
    VCPlaceholderWrapper,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCPlaceholder: typeof VCPlaceholder;
        VCPlaceholderWrapper: typeof VCPlaceholderWrapper;
    }
}
