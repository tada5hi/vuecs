<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { buildFormGroup, buildFormTextarea } from '@vuecs/form-controls';
import { maxLength, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, reactive,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            text: 'foo',
        });

        const $v = useVuelidate({
            text: {
                minLength: minLength(5),
                maxLength: maxLength(10),
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

        return () => buildFormGroup({
            label: true,
            labelContent: 'Label',
            validationMessages: validationMessages.value,
            content: buildFormTextarea({
                value: form.text,
                onChange(input) {
                    form.text = input;
                },
            }),
        });
    },
});
</script>
