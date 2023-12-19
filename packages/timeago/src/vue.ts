import type { Ref } from 'vue';
import type { VCTimeago } from './component';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCTimeago: typeof VCTimeago;
    }

    interface ComponentCustomProperties {
        $timeagoLocale?: Ref<string>;
        // Add other custom properties here
    }
}
