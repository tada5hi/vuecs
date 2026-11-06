import type { VCCountdown } from './component';

declare module 'vue' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
    export interface GlobalComponents {
        VCCountdown: typeof VCCountdown
    }
}
