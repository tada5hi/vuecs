import type { VCGravatar } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCGravatar: typeof VCGravatar;
    }
}
