import type {
    VCPlaceholder,
    VCPlaceholderWrapper,
} from './components';

declare module 'vue' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
    export interface GlobalComponents {
        VCPlaceholder: typeof VCPlaceholder;
        VCPlaceholderWrapper: typeof VCPlaceholderWrapper;
    }
}
