import type { VCCountdown } from './component';

declare module 'vue' {
    export interface GlobalComponents {
        VCCountdown: typeof VCCountdown
    }
}
