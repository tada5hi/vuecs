import type { VCGravatar } from './component';

declare module 'vue' {
    export interface GlobalComponents {
        VCGravatar: typeof VCGravatar;
    }
}
