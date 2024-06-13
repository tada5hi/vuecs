<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import type { FormSelectOption } from '@vuecs/form-controls';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            value: '',
        });

        const $v = useVuelidate({
            value: {
                required,
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.value);

        const options : FormSelectOption[] = [];

        for (let i = 1; i <= 100; i++) {
            options.push({ id: i, value: `Option ${i}` });
        }

        return {
            form,
            options,
            validationMessages,
            v$: $v,
        };
    },
});
</script>
<template>
    <VCFormGroup
        :label="true"
        :label-content="'Label'"
        :validation-messages="validationMessages"
    >
        <VCFormSelectSearch
            v-model="form.value"
            :options="options"
        />
    </VCFormGroup>
</template>
