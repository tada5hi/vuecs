import { applyStoreManagerOptions, installStoreManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/form-select-search.css';
import '../assets/form-range-multi-slider.css';
import './vue';

import {
    VCFormGroup,
    VCFormInput,
    VCFormInputCheckbox,
    VCFormRangeMultiSlider,
    VCFormSelect,
    VCFormSelectSearch,
    VCFormSubmit,
    VCFormTextarea,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './type';

export function install(instance: App, options: Options = {}) : void {
    const storeManager = installStoreManager(instance);
    if (options.storeManager) {
        applyStoreManagerOptions(storeManager, options.storeManager);
    }

    Object.entries({
        VCFormGroup,
        VCFormInputCheckbox,
        VCFormInput,
        VCFormRangeMultiSlider,
        VCFormSelect,
        VCFormSelectSearch,
        VCFormSubmit,
        VCFormTextarea,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default {
    install,
} satisfies Plugin<Options | undefined>;
