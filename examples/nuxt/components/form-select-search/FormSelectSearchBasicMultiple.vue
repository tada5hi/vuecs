<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import type { FormOption } from '@vuecs/forms';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent,
    reactive,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive<{ value: number[] }>({ value: [] });

        const $v = useVuelidate({ value: { required } }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.value);

        const options : FormOption<number>[] = [];

        for (let i = 1; i <= 100; i++) {
            options.push({ value: i, label: `Option ${i}` });
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
        :validation-result="v$.value"
    >
        <VCFormSelectSearch
            v-model="form.value"
            :options="options"
        />
    </VCFormGroup>
</template>
