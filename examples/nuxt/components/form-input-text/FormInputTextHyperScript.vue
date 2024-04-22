<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { getSeverity, useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { buildFormGroup, buildFormInputText } from '@vuecs/form-controls';
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
            validationSeverity: getSeverity($v.value.text),
            validationMessages: validationMessages.value,
            content: buildFormInputText({
                value: $v.value.text.$model,
                onChange(input) {
                    $v.value.text.$model = input;
                },
            }),
        });
    },
});
</script>
