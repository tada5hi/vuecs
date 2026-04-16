import type { App, Plugin } from 'vue';

import './vue';

// Import vue components
import {
    VCGravatar,
} from './component';
import type { Options } from './type';

export * from './component';
export * from './type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function install(instance: App, options: Options = {}) : void {
    instance.component('VCGravatar', VCGravatar);
}

export default { install } satisfies Plugin<Options | undefined>;
