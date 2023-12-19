import type { App, Plugin } from 'vue';
import type { Options } from './type';

import './vue';

// Import vue components
import {
    VCCountdown,
} from './component';

export * from './component';
export * from './type';

export function install(instance: App, options: Options = {}) : void {
    instance.component('VCCountdown', VCCountdown);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
