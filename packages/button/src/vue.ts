import type { VCButton } from './component';

declare module 'vue' {
    export interface GlobalComponents {
        VCButton: typeof VCButton,
    }
}
