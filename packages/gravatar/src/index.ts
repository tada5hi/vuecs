import type { App, Plugin, Ref } from 'vue';

import './vue';

// Import vue components
import {
    VCGravatar,
} from './component';
import type { Options } from './type';

export * from './component';
export * from './type';

export function install(instance: App, options: Options = {}) : void {
    instance.component('VCGravatar', VCGravatar);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
