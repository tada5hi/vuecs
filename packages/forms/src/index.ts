import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import type { App, Plugin } from 'vue';

import '../assets/form-checkbox.css';
import '../assets/form-checkbox-group.css';
import '../assets/form-input.css';
import '../assets/form-number.css';
import '../assets/form-pin.css';
import '../assets/form-radio.css';
import '../assets/form-select.css';
import '../assets/form-select-search.css';
import '../assets/form-slider.css';
import '../assets/form-switch.css';
import '../assets/form-tags.css';
import './vue';

import {
    VCFormCheckbox,
    VCFormCheckboxGroup,
    VCFormGroup,
    VCFormInput,
    VCFormNumber,
    VCFormPin,
    VCFormRadio,
    VCFormRadioGroup,
    VCFormSelect,
    VCFormSelectSearch,
    VCFormSlider,
    VCFormSwitch,
    VCFormTags,
    VCFormTextarea,
} from './components';
import type { Options } from './type';

export * from './components';
export * from './composables';
export * from './type';
export * from './types';

export function install(instance: App, options: Options = {}): void {
    installThemeManager(instance, options);
    installDefaultsManager(instance, options);

    Object.entries({
        VCFormCheckbox,
        VCFormCheckboxGroup,
        VCFormGroup,
        VCFormInput,
        VCFormNumber,
        VCFormPin,
        VCFormRadio,
        VCFormRadioGroup,
        VCFormSelect,
        VCFormSelectSearch,
        VCFormSlider,
        VCFormSwitch,
        VCFormTags,
        VCFormTextarea,
    }).forEach(([componentName, component]) => {
        instance.component(componentName, component);
    });
}

export default { install } satisfies Plugin<[Options?]>;
