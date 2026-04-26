import type { VCButton } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCButton: typeof VCButton,
    }
}
