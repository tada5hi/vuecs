/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    FormGroup,
    FormInput,
    FormInputCheckbox,
    FormSelect,
    FormSubmit,
    FormTextarea,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        FormGroup: typeof FormGroup,
        FormInput: typeof FormInput,
        FormInputCheckbox: typeof FormInputCheckbox,
        FormSelect: typeof FormSelect,
        FormSubmit: typeof FormSubmit,
        FormTextarea: typeof FormTextarea,
    }
}
