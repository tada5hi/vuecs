/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
