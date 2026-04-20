<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { VCFormGroup, VCFormTextarea } from '@vuecs/form-controls';
import { maxLength, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent,
    h,
    reactive,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({ text: 'foo' });

        const $v = useVuelidate({
            text: {
                minLength: minLength(5),
                maxLength: maxLength(10),
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

        return () => h(VCFormGroup, {
            label: true,
            labelContent: 'Label',
            validationMessages: validationMessages.value,
        }, {
            default: () => h(VCFormTextarea, {
                modelValue: form.text,
                'onUpdate:modelValue': (input: string) => { form.text = input; },
            }),
        });
    },
});
</script>
