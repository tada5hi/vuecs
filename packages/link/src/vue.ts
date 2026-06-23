import type { VCLink } from './component';

declare module 'vue' {
    export interface GlobalComponents {
        VCLink: typeof VCLink;
    }
}
