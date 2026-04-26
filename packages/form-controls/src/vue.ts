import type {
    VCFormGroup,
    VCFormInput,
    VCFormInputCheckbox,
    VCFormRangeMultiSlider,
    VCFormSelect,
    VCFormSelectSearch,
    VCFormTextarea,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCFormGroup: typeof VCFormGroup,
        VCFormInput: typeof VCFormInput,
        VCFormInputCheckbox: typeof VCFormInputCheckbox,
        VCFormRangeMultiSlider: typeof VCFormRangeMultiSlider,
        VCFormSelect: typeof VCFormSelect,
        VCFormSelectSearch: typeof VCFormSelectSearch,
        VCFormTextarea: typeof VCFormTextarea,
    }
}
