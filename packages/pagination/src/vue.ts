import type VCPagination from './component.vue';

declare module 'vue' {
    export interface GlobalComponents {
        VCPagination: typeof VCPagination
    }
}
