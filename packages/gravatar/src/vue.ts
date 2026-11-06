import type { VCGravatar } from './component';

declare module 'vue' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
    export interface GlobalComponents {
        VCGravatar: typeof VCGravatar;
    }
}
