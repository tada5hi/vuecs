import type {
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

declare module 'vue' {
    export interface GlobalComponents {
        VCFormCheckbox: typeof VCFormCheckbox,
        VCFormCheckboxGroup: typeof VCFormCheckboxGroup,
        VCFormGroup: typeof VCFormGroup,
        VCFormInput: typeof VCFormInput,
        VCFormNumber: typeof VCFormNumber,
        VCFormPin: typeof VCFormPin,
        VCFormRadio: typeof VCFormRadio,
        VCFormRadioGroup: typeof VCFormRadioGroup,
        VCFormSelect: typeof VCFormSelect,
        VCFormSelectSearch: typeof VCFormSelectSearch,
        VCFormSlider: typeof VCFormSlider,
        VCFormSwitch: typeof VCFormSwitch,
        VCFormTags: typeof VCFormTags,
        VCFormTextarea: typeof VCFormTextarea,
    }
}
