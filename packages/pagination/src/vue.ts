import type { VCPagination } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCPagination: typeof VCPagination
    }
}
