import type { VCLink } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCLink: typeof VCLink;
    }
}
