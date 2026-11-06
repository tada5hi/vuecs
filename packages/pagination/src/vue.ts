import type VCPagination from './component.vue';

declare module 'vue' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public name and declaration merging.
    export interface GlobalComponents {
        VCPagination: typeof VCPagination
    }
}
