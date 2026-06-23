import type {
    VCPlaceholder,
    VCPlaceholderWrapper,
} from './components';

declare module 'vue' {
    export interface GlobalComponents {
        VCPlaceholder: typeof VCPlaceholder;
        VCPlaceholderWrapper: typeof VCPlaceholderWrapper;
    }
}
