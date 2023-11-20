/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
