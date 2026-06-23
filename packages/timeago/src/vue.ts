import type { VCTimeago } from './component';

declare module 'vue' {
    export interface GlobalComponents {
        VCTimeago: typeof VCTimeago;
    }
}
