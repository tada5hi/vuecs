import type { VCCountdown } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCCountdown: typeof VCCountdown
    }
}
