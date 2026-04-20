<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { VCFormGroup, VCFormSelect } from '@vuecs/form-controls';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent,
    h,
    reactive,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({ text: '' });

        const $v = useVuelidate({ text: { required } }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

        const options = [
            { id: 1, value: 'Option 1' },
            { id: 2, value: 'Option 2' },
        ];

        return () => h(VCFormGroup, {
            label: true,
            labelContent: 'Label',
            validationMessages: validationMessages.value,
        }, {
            default: () => h(VCFormSelect, {
                modelValue: form.text,
                'onUpdate:modelValue': (input: string) => { form.text = input; },
                options,
            }),
        });
    },
});
</script>
