import type VCPagination from './component.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCPagination: typeof VCPagination
    }
}
