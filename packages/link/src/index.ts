import type { App, Plugin } from 'vue';

import './vue';

// Import vue components
import {
    VCLink,
} from './component';
import type { Options } from './types';

export * from './component';
export * from './types';

export function install(instance: App, options?: Options) : void {
    instance.component('VCLink', VCLink);
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
