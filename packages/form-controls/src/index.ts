/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { applyPluginBaseOptions } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import './vue';

import {
    VCFormGroup,
    VCFormInput,
    VCFormInputCheckbox,
    VCFormSelect,
    VCFormSubmit,
    VCFormTextarea,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './type';

export function install(instance: App, options?: Options) : void {
    options ??= {};

    applyPluginBaseOptions(instance, options);

    Object.entries({
        VCFormGroup,
        VCFormInputCheckbox,
        VCFormInput,
        VCFormSelect,
        VCFormSubmit,
        VCFormTextarea,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
