import type {
    VCFormGroup,
    VCFormInput,
    VCFormInputCheckbox,
    VCFormRangeMultiSlider,
    VCFormSelect,
    VCFormSelectSearch,
    VCFormSubmit,
    VCFormTextarea,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCFormGroup: typeof VCFormGroup,
        VCFormInput: typeof VCFormInput,
        VCFormInputCheckbox: typeof VCFormInputCheckbox,
        VCFormRangeMultiSlider: typeof VCFormRangeMultiSlider,
        VCFormSelect: typeof VCFormSelect,
        VCFromSelectSearch: typeof VCFormSelectSearch,
        VCFormSubmit: typeof VCFormSubmit,
        VCFormTextarea: typeof VCFormTextarea,
    }
}
