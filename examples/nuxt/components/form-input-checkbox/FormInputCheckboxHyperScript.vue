<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { buildFormGroup, buildFormInputCheckbox } from '@vuecs/form-controls';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            text: null,
        });

        const $v = useVuelidate({
            text: {
                required,
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

        return () => buildFormGroup({
            label: true,
            labelContent: 'Label',
            validationMessages: validationMessages.value,
            content: buildFormInputCheckbox({
                value: form.text,
                onChange(input) {
                    form.text = input;
                },
            }),
        });
    },
});
</script>
