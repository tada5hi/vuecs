import type { VCTimeago } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCTimeago: typeof VCTimeago;
    }
}
