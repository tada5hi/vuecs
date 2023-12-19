import type {
    VCFormGroup,
    VCFormInput,
    VCFormInputCheckbox,
    VCFormSelect,
    VCFormSubmit,
    VCFormTextarea,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCFormGroup: typeof VCFormGroup,
        VCFormInput: typeof VCFormInput,
        VCFormInputCheckbox: typeof VCFormInputCheckbox,
        VCFormSelect: typeof VCFormSelect,
        VCFormSubmit: typeof VCFormSubmit,
        VCFormTextarea: typeof VCFormTextarea,
    }
}
