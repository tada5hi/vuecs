<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { buildFormGroup, buildFormInputCheckbox } from '@vuecs/form-controls';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            value: null,
        });

        const $v = useVuelidate({
            value: {
                required,
            },
        }, form);

        const validationMessages = {
            required: 'The input is required.',
        };

        return () => buildFormGroup({
            label: true,
            labelContent: 'Label',
            validationMessages,
            validationResult: $v.value.value,
            content: buildFormInputCheckbox({
                value: form.value,
                onChange(input) {
                    form.value = input;
                },
            }),
        });
    },
});
</script>
