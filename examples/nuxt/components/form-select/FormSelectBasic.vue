<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            text: '',
        });

        const $v = useVuelidate({
            text: {
                required,
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

        const options = [
            { id: 1, value: 'Option 1' },
            { id: 2, value: 'Option 2' },
        ];

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
        <VCFormSelect
            v-model="form.text"
            :options="options"
        />
    </VCFormGroup>
</template>
